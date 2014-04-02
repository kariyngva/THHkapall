(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
    score = $('.score'),
    trashDeck = $('.trashdeck'),

    trackTime = function ( startTime ) {
      var timeElm = $('.time'),
          minElm =timeElm.find('.minutes'),
          secElm =timeElm.find('.seconds'),
          timeInterval = setInterval( function () {
            //Calculated elapsed time.
            var currTime = new Date(),
                elapsed = currTime.getTime() - startTime.getTime(),
                minutes = Math.floor( ( elapsed / 1000 ) / 60 ),
                seconds = Math.floor( ( elapsed / 1000 ) % 60 );

                //Update dom
                minElm.text( minutes < 10 ? '0' + minutes : minutes );
                secElm.text( seconds < 10 ? '0' + seconds : seconds );
            }, 1000);
      },

    initDragDrop = function (cards) {
        //Gerum 'cards' draggable og droppable.
        cards
          .draggable({
            scope: 'card',
            revert: 'invalid',
            //snap: true,
            drag: function () {},
            start: function (event, ui) {
                var card = $(this),
                    cardIndex = {
                        i: parseInt( card.find('.i').text(), 10 ) || 0,
                        j: parseInt( card.find('.j').text(), 10 ) || 0
                      },
                    canMoveCard = card.parents('.pyramid').length ? isFree( cardIndex.i, cardIndex.j ) : true;

                //Stop a card from being dragged if it's not free
                //Should always be at the bottom so we don't prematurly return
                if( !canMoveCard  )
                {
                  return false;
                }

                cardDragged = card;
            },
            stop: function (event, ui) {
                if($('.drawdeck').find('.card').length === 0){
                  //Not sure if we should do anything here
                }
            }
          });
        cards
          .droppable({
            scope:'card',
            tolerance: 'touch',
            revert: 'invalid',
            accept: function (elm) {
                var val1 = parseInt( elm.find('.value').eq(0).text(), 10 ),
                    val2 = parseInt( $(this).find('.value').eq(0).text(), 10 );

                var card = $(this),
                    cindex = {
                      i: parseInt(card.find('.i').text(), 10 ),
                      j: parseInt(card.find('.j').text(), 10 )
                    };
                //Ætlum ekki að accepta drop ef spilin eru ekki með 13 sem samanlagt gildi

                if( card.parents('.pyramid').length && isFree( cindex.i, cindex.j ) && (val1 + val2) === 13 )
                {
                  return true;
                }
                else if( (!card.parents('.pyramid').length && val1 + val2) === 13 )
                {
                  return true;
                }

                return false;
            },
            drop: function (event, ui) {
                cardDroppedOn = $(this);

                //Erum við að draga milli stokka
                var isDeckToDeck = ( cardDroppedOn.parents('.drawdeck').length && cardDragged.parents('.trashdeck').length )
                                  || ( cardDroppedOn.parents('.trashdeck').length && cardDragged.parents('.drawdeck').length );

                //indexes of cards in the pyramid.
                var cIndex = {
                      i: parseInt(cardDragged.find('.i').text(), 10 ),
                      j: parseInt(cardDragged.find('.j').text(), 10 ),
                      k: parseInt(cardDroppedOn.find('.i').text(), 10 ),
                      l: parseInt(cardDroppedOn.find('.j').text(), 10 )
                    };

                //Athugum hvort við séum að draga spil innan píramída
                if( cardDragged.parents('.pyramid').length &&
                    pyramidToPyramid(cIndex.i, cIndex.j, cIndex.k, cIndex.l) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');
                }
                else if ( isDeckToDeck && deckToDeck() ) //erum við að draga milli stokka, og er það leyfilegt
                {
                  cardDragged.addClass('gone');
                  cardDroppedOn.addClass('gone');

                  cardDragged.remove();
                  cardDroppedOn.remove();

                  drawFromMainDeck( true );
                  drawFromActiveDeck();
                }
                else if( cardDragged.parents('.drawdeck').length && cardDroppedOn.parents('.pyramid').length &&
                         deckToPyramid( cardDragged, cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');

                  drawFromMainDeck();
                }
                else if( cardDragged.parents('.trashdeck').length && cardDroppedOn.parents('.pyramid').length &&
                         deckToPyramid( cardDragged, cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');

                  drawFromActiveDeck();
                }

                updateScore();

            },
            over: function (event, ui) {

            },
            out: function (event, ui) {
                $(this).css("border-color", "pink");
            }
          });
      },

    //Ajax call til að uppfæra stigin
    updateScore = function () {
        $.ajax({
          url: '/updatescore',
          dataType: 'json'
        }).done(function(data) {
            score.text(data.score);
          });
    },

    highscore = function () {
        $.ajax({
          url: '/highscore',
          dataType: 'json'
        }).done(function(data) {
            score;
          });
    },


    drawFromMainDeck = function ( wasKing ) {
      wasKing = wasKing === undefined ? false : true;
      ;;;window.console&&console.log( 'kall á drawFromMainDeck með: ' + wasKing );
      var result = false;
        $.ajax({
          url: '/drawFromMainDeck',
          async: false,
          dataType: 'json'
        }).done( function( data ) {
            if( data.lastcard != -1 )
            {
              var isHigh = data.val > 10 ? data.rank : '';
              result = $('<div class="card free ' + data.suit + ' ' + isHigh + '">' +
                            '<span class="value v1">' + data.val + '</span>' +
                            '<span class="value v2">' + data.val + '</span>' +
                          '</div>');

              //Gerum spilið drag/droppable
              initDragDrop( result );
            }
          });

        //Gerum ekkert ef stokkurinn er tómur.
        if( result != false )
        {
          var newTrashCard = drawDeck.find('.card')

          if( drawDeck.find('.card').length && !wasKing )
          {
            ;;;window.console&&console.log( 'empty trashDeck' );
            trashDeck.empty();
            trashDeck.prepend( newTrashCard );
          }

          drawDeck.prepend( result );
        }
    },

    drawFromActiveDeck = function () {
      var result = false;
        $.ajax({
          url: '/drawFromActiveDeck',
          async: false,
          dataType: 'json'
        }).done( function( data ) {
            if( data.lastcard != -1 )
            {
              var isHigh = data.val > 10 ? data.rank : '';
              result = $('<div class="card free ' + data.suit + ' ' + isHigh + '">' +
                            '<span class="value v1">' + data.val + '</span>' +
                            '<span class="value v2">' + data.val + '</span>' +
                          '</div>');

              //Gerum spilið drag/droppable
              initDragDrop( result );
            }
          });

        //Gerum ekkert ef stokkurinn er tómur.
        if( result != false )
        {
          trashDeck.prepend( result );
          ;;;window.console&&console.log( 'ACTIVE' );
        }
    },

    getStartTime = function ( i, j ) {
      var result = false;
        $.ajax({
          url: '/getstarttime',
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.starttime;
          });
        return result;
    },

    isFree = function ( i, j ) {
      var result = false;
        $.ajax({
          url: '/isfree/' + i + '/' + j,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.isfree;
          });
        return result;
    },

    checkKingPyr = function ( i, j ) {
      var result = false;
        $.ajax({
          url: '/checkKingPyr/' + i + '/' + j,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
          });
        return result;
    },

    checkKingDeck = function ( card ) {
      var result = false;
        $.ajax({
          url: '/kingdeck/' + card.parents('.drawdeck').length,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
          });
        return result;
    },

    pyramidToPyramid = function ( i, j, k, l ) {
      var result = false;
        $.ajax({
          url: '/pyramidToPyramid/' + i + '/' + j + '/' + k + '/' + l,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
          });
        return result;
    },

    deckToDeck = function () {
      var result = false;
        $.ajax({
          url: '/decktodeck',
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
          });
        return result;
    },

    deckToPyramid = function ( card, i, j ) {
      var result = false;
        $.ajax({
          url: '/deckToPyramid/' + card.parents('.drawdeck').length + '/' + i + '/' + j,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
            if( result )
              card.remove();
          });
        return result;
      };


    //Bindum smell á stokk.
    $bdy.on('click.drawCard', '.drawdeck .card', function (e) {
        var card = $(this);

        //Drögum aðeins ef spilið er ekki
        if( checkKingDeck( card ) )
        {
          drawFromMainDeck( true );
          card.addClass('gone');
          card.remove();
          updateScore();
        }
        else
        {
          drawFromMainDeck();
        }
      });

    //Bindum smelli alla kónga og athugum þegar smellt er á þau hvort við megum fjarlægja þá
    //úr píramída eða stokk
    $bdy.on('click', '.king', function (e) {
        var card = $(this),
            inPyramid = card.parents('.pyramid').length,
            inDrawDeck = card.parents('.decks').length,
            cIndex = {
              i: parseInt(card.find('.i').text(), 10 ),
              j: parseInt(card.find('.j').text(), 10 )
            };

        if( inPyramid && checkKingPyr( cIndex.i, cIndex.j ) )
        {
          card.addClass('gone');
        }
        /*else if( checkKingDeck( card ) )
        {
          card.addClass('gone');
          //drawFromMainDeck();
        }*/

        updateScore();
      });

    //Gerum öll spilin í dominu draggable og droppable.
    initDragDrop( $('.card') );

    //log time
    var startTime = getStartTime();
    trackTime( startTime === false ? new Date() : new Date( startTime ) );
})($);