(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
    score = $('.score'),
    trashDeck = $('.trashdeck'),

    //Teljum tímann woop woop
    trackTime = function ( startTime ) {
      var timeElm = $('.time'),
          minElm =timeElm.find('.minutes'),
          secElm =timeElm.find('.seconds'),
          timeInterval = setInterval( function () {

            //Reiknum tímann sem hefur liðið
            var currTime = new Date(),
                elapsed = currTime.getTime() - startTime.getTime(),
                minutes = Math.floor( ( elapsed / 1000 ) / 60 ),
                seconds = Math.floor( ( elapsed / 1000 ) % 60 );

                //Uppfærum domið
                minElm.text( minutes < 10 ? '0' + minutes : minutes );
                secElm.text( seconds < 10 ? '0' + seconds : seconds );
            }, 1000);
      },


    //Gerum 'cards' draggable og droppable.
    initDragDrop = function (cards) {
        cards
          .draggable({
            scope: 'card',
            revert: 'invalid',
            //snap: true,
            start: function (event, ui) {
                var card = $(this),
                    cardIndex = {
                        i: parseInt( card.find('.i').text(), 10 ) || 0,
                        j: parseInt( card.find('.j').text(), 10 ) || 0
                      },
                    canMoveCard = card.parents('.pyramid').length ? isFree( cardIndex.i, cardIndex.j ) : true;
                    //Sé spilið ekki í píramída þurfum við ekki að tékka isFree ^

                //Stop a card from being dragged if it's not free
                //Should always be at the bottom so we don't prematurly return
                //leyfum ekki start drag bena að spilið sé "frjálst"
                if( !canMoveCard  )
                {
                  return false;
                }

                cardDragged = card;
            }
          });

        cards
          .droppable({
            scope:'card',
            tolerance: 'touch',
            revert: 'invalid',
            accept: function (elm) {
                var card = $(this),
                    isInPyramid = card.parents('.pyramid').length,
                    val1 = parseInt( elm.find('.value').eq(0).text(), 10 ),
                    val2 = parseInt( card.find('.value').eq(0).text(), 10 ),
                    cindex = {
                      i: parseInt(card.find('.i').text(), 10 ),
                      j: parseInt(card.find('.j').text(), 10 )
                    };

                //Ætlum ekki að accepta drop ef spilin eru ekki með 13 sem samanlagt gildi
                if( isInPyramid && isFree( cindex.i, cindex.j ) && (val1 + val2) === 13 )
                {
                  return true;
                }
                else if( !isInPyramid && (val1 + val2) === 13 )
                {
                  return true;
                }

                return false;
            },

            drop: function (event, ui) {
                cardDroppedOn = $(this);

                //Erum við að draga milli stokka?
                var isDeckToDeck = ( cardDroppedOn.parents('.drawdeck').length && cardDragged.parents('.trashdeck').length )
                                  || ( cardDroppedOn.parents('.trashdeck').length && cardDragged.parents('.drawdeck').length );

                //vísar í spil innan píramída
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

                  getTopOfMain();
                  drawFromActiveDeck();

                }
                else if( cardDragged.parents('.drawdeck').length && cardDroppedOn.parents('.pyramid').length &&
                         deckToPyramid( cardDragged, cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');

                  getTopOfMain();
                }
                else if( cardDragged.parents('.trashdeck').length && cardDroppedOn.parents('.pyramid').length &&
                         deckToPyramid( cardDragged, cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');

                  drawFromActiveDeck();
                }

                updateScore();
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

            if( isGameWon() )
            {
              setTimeout(function () {
                var name = prompt("Til hamingju þú hefur unnið! Sláðu inn nafnið þitt", "Panda");
                if( name )
                {
                  setHighscore( name );
                }
                }, 500);
            }
          });
    },


    //Skilar og poppar efsta spili aðal stokks (drawDekc/mainDeck)
    drawFromMainDeck = function () {
      var result = false;
        $.ajax({
          url: '/drawFromMainDeck',
          async: false,
          dataType: 'json'
        }).done( function( data ) {
            if( data.lastcard != -1 )
            {
              var isHigh = data.val > 9 || data.val === 1  ? data.rank : '';
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

          if( drawDeck.find('.card').length )
          {
            trashDeck.empty();
            trashDeck.prepend( newTrashCard );
          }

          drawDeck.prepend( result );
        }
    },


    //Skilar efsta spili aðal stokks (drawDekc/mainDeck)
    getTopOfMain = function () {
      var result = false;
        $.ajax({
          url: '/getTopOfMain',
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
      },


    setHighscore = function ( name ) {
        $.ajax({
          url: '/sethighscore/' + name
        }).done(function () {
          window.location = '/highscore';
          });
      },


    isGameWon = function () {
      var result = false;
        $.ajax({
          url: '/checkwin',
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
          });
        return result;
      };


    //Bindum smell á stokk.
    $bdy.on('click.drawCard', '.drawdeck .card', function (e) {
        var card = $(this);

        //Ef efsta spilið er kóngur viljum við bara fjarlægja það og poppa mainDeck en ekki active
        if( checkKingDeck( card ) )
        {
          getTopOfMain();
          card.addClass('gone');
          card.remove();
          updateScore();
        }
        else
        {
          drawFromMainDeck();
        }
      });

    //Bindum smelli á alla kónga og athugum þegar smellt er á þau hvort við megum fjarlægja þá
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

        updateScore();
      });

    //Gerum öll spilin í dominu draggable og droppable.
    initDragDrop( $('.card') );

    //log time
    var startTime = getStartTime();
    trackTime( startTime === false ? new Date() : new Date( startTime ) );

    //Flip cards
    var cards = $('.card');
    var counter = 30;

    cards.each(function () {
        var card = $(this);

        setTimeout(function () {
            card.removeClass('flipped');
          }, 300 + counter);

        counter += 100;
      });

})($);