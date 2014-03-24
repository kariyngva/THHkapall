(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
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
                  ;;;window.console&&console.log( ['drawdeck empty'] );
                  drawDeck.trigger('click');
                }
            }
          })
          .droppable({
            scope:'card',
            tolerance: 'touch',
            revert: 'invalid',
            accept: function (elm) {
                var val1 = parseInt( elm.find('.value').text(), 10 ),
                    val2 = parseInt( $(this).find('.value').text(), 10 );

                //Ætlum ekki að accepta drop ef spilin eru ekki með 13 sem samanlagt gildi
                if( (val1 + val2) != 13 )
                {
                  return false;
                }

                return true;
            },
            drop: function (event, ui) {

                $(this).css("border-color", "lightgreen")

                cardDroppedOn = $(this);

                //indexes of cards in the pyramid.
                var cIndex = {
                      i: parseInt(cardDragged.find('.i').text(), 10 ),
                      j: parseInt(cardDragged.find('.j').text(), 10 ),
                      k: parseInt(cardDroppedOn.find('.i').text(), 10 ),
                      l: parseInt(cardDroppedOn.find('.j').text(), 10 )
                    };

                if( cardDragged.parents('.pyramid').length && pyramidToPyramid(cIndex.i, cIndex.j, cIndex.k, cIndex.l) )
                {
                  //do magic
                  //ajax kall á increase score (gui)
                  //Sækjum nýtt spil úr discard pile og fake-um move í discardhrúguna
                  //cleanup

                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');
                }
                else if( cardDroppedOn.parents('.pyramid').length && deckToPyramid( cardDragged.parents('.drawdeck').length , cIndex.k, cIndex.l ) )
                {
                  cardDroppedOn.addClass('gone');
                  cardDragged.addClass('gone');
                }

            },
            over: function (event, ui) {
                $(this).css("border-color", "blue")
            },
            out: function (event, ui) {
                $(this).css("border-color", "pink")
            }
          });
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

    deckToPyramid = function ( fromDraw, i, j ) {
      var result = false;
        $.ajax({
          url: '/deckToPyramid/' + fromDraw + '/' + i + '/' + j,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
            ;;;window.console&&console.log( [result] );
            ;;;window.console&&console.log( [fromDraw + '/' + i + '/' + j] );
          });
        return result;
      };


    //Bindum smell á stokk.
    drawDeck.on('click.drawDeck', function (e) {

        ;;;window.console&&console.log( ['boom'] );
        //passa að láta click + drag cancela click event.
        //e.preventDefault();

        $html.addClass('ajax-wait');
        $.get('http://localhost:8080/drawFromDeck')
          .done(function(data) {
              if(data.lastcard != -1)
              {
                //Overwrite the card in the trashdeck
                newTrashCard = drawDeck.find('.card');
                trashDeck.empty();
                trashDeck.prepend(newTrashCard);
                card = $('<div class="card free ' + data.suit + '"><span class="value">' + data.rank + '</span></div>');

                //Get a new card from the drawDeck deck
                if(data.rank === "king")
                {
                  card.addClass('king');
                }
                drawDeck.prepend(card);
              }
              else
              {
                ;;;window.console&&console.log( ['bled'] );
              }
            })
          .always(function() {
              $html.removeClass('ajax-wait');
            });
    });

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

    //Initum öll spilin sem draggable og droppable sem eru í dominu.
    initDragDrop($('.card'));

/*$(document).ready(function () {

    var cardDragged;
    var cardDroppedOn;


    $('.card')
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
              ;;;window.console&&console.log( ['drawdeck empty'] );
              drawDeck.trigger('click');
            }
        }
      })
      .droppable({
        scope:'card',
        tolerance: 'touch',
        revert: 'invalid',
        accept: function (elm) {
          var val1 = parseInt( elm.find('.value').text(), 10 ),
              val2 = parseInt( $(this).find('.value').text(), 10 );
              //$(this).css('border-color', 'aqua');
          if( (val1 + val2) != 13 )
          {
            return false;
          }
          return true;
          },
        drop: function (event, ui) {

            $(this).css("border-color", "lightgreen")
            cardDroppedOn = $(this),
            cIndex = { //indexes of cards in the pyramid.
              i: parseInt(cardDragged.find('.i').text(), 10 ),
              j: parseInt(cardDragged.find('.j').text(), 10 ),
              k: parseInt(cardDroppedOn.find('.i').text(), 10 ),
              l: parseInt(cardDroppedOn.find('.j').text(), 10 )
            };

            if( cardDragged.parents('.pyramid').length && pyramidToPyramid(cIndex.i, cIndex.j, cIndex.k, cIndex.l) )
            {
              //do magic
              //ajax kall á increase score (gui)
              //Sækjum nýtt spil úr discard pile og fake-um move í discardhrúguna
              //cleanup

              cardDroppedOn.addClass('gone');
              cardDragged.addClass('gone');
            }
            else if( cardDroppedOn.parents('.pyramid').length && deckToPyramid( cardDragged.parents('.drawdeck').length , cIndex.k, cIndex.l ) )
            {
              cardDroppedOn.addClass('gone');
              cardDragged.addClass('gone');
            }

        },
        over: function (event, ui) {
            $(this).css("border-color", "blue")
        },
        out: function (event, ui) {
            $(this).css("border-color", "pink")
        }
      });
});*/


})($);