(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
    score = $('.score'),
    trashDeck = $('.trashdeck'),

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

                //Ætlum ekki að accepta drop ef spilin eru ekki með 13 sem samanlagt gildi
                if( (val1 + val2) != 13 )
                {
                  return false;
                }

                return true;
            },
            drop: function (event, ui) {
                cardDroppedOn = $(this);

                var isDeckToDeck = ( cardDroppedOn.parents('.drawdeck').length && cardDragged.parents('.trashdeck').length )
                                  || ( cardDroppedOn.parents('.trashdeck').length && cardDragged.parents('.drawdeck').length );

                //indexes of cards in the pyramid.
                var cIndex = {
                      i: parseInt(cardDragged.find('.i').text(), 10 ),
                      j: parseInt(cardDragged.find('.j').text(), 10 ),
                      k: parseInt(cardDroppedOn.find('.i').text(), 10 ),
                      l: parseInt(cardDroppedOn.find('.j').text(), 10 )
                    };

                if( cardDragged.parents('.pyramid').length &&
                    pyramidToPyramid(cIndex.i, cIndex.j, cIndex.k, cIndex.l) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');
                }
                else if( cardDroppedOn.parents('.pyramid').length &&
                         deckToPyramid( cardDragged, cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');
                  drawFromMainDeck();
                }
                else if ( isDeckToDeck && deckToDeck() )
                {
                  cardDragged.addClass('gone');
                  cardDroppedOn.addClass('gone');

                  //TODO:búa til fall sem checkar á trashdeck og bætir við efsta spilinu ef eitthvað
                  drawFromMainDeck();
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

    updateScore = function () {
        $.ajax({
          url: '/updatescore',
          dataType: 'json'
        }).done(function(data) {
            score.text(data.score);
          });
    },

    drawFromMainDeck = function () {
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
            card.remove();
          });
        return result;
      };


    //Bindum smell á stokk.
    drawDeck.on('click.drawDeck', function (e) {
        drawFromMainDeck();
    });

    //Höndlum smell á erfileikatakka
    //TODO:refactor/ eyða
    $('.difficulty a').on('click', function (e) {
        e.preventDefault();

        var link = $(this);
        $.ajax({
          url: link.attr('href')
        }).done(function(data) {
            $('.difficulty a').removeClass('current');
            link.addClass('current');
          });
      });

    //Bindum smelli á öll spil og athugum þegar smellt er á þau hvort gildi spilsins sé 13
    //og fjarlægjum þá úr píramída/stokki.
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
        else if( checkKingDeck( card ) )
        {
          card.addClass('gone');
          drawFromMainDeck();
        }

        updateScore();
      });

    //Initum öll spilin sem draggable og droppable sem eru í dominu.
    initDragDrop( $('.card') );
})($);