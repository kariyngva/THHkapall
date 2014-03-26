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
              ;;;window.console&&console.log( ['start'] );
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
                  //do magic
                  //ajax kall á increase score (gui)
                  //Sækjum nýtt spil úr discard pile og fake-um move í discardhrúguna
                  //cleanup

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

            },
            over: function (event, ui) {

            },
            out: function (event, ui) {
                $(this).css("border-color", "pink");
            }
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
          var newTrashCard = drawDeck.find('.card');
          if( newTrashCard.length )
          {
            ;;;window.console&&console.log( ['mm'] );
            trashDeck.find('.card').replaceWith( newTrashCard );
            //trashDeck.prepend( newTrashCard );
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

    deckToPyramid = function ( card, i, j ) {
      var result = false;
        $.ajax({
          url: '/deckToPyramid/' + card.parents('.drawdeck').length + '/' + i + '/' + j,
          async: false,
          dataType: 'json'
        }).done(function(data) {
            result = data.success;
            ;;;window.console&&console.log( 'deckToPyramid'+result );
            ;;;window.console&&console.log( card );
            ;;;window.console&&console.log( card.parents('.drawdeck').length );
            //card.remove();
            //TODO:Sækja nýtt spil í drawdeck
          });
        return result;
      };


    //Bindum smell á stokk.
    drawDeck.on('click.drawDeck', function (e) {

        drawFromMainDeck();
        ;;;window.console&&console.log( ['boom'] );
        //passa að láta click + drag cancela click event.
        //e.preventDefault();
        //card fær false ef mainDeck er tómur annars spilið sem er efst í stokknum

        /*$html.addClass('ajax-wait');
        $.get('http://localhost:8080/drawFromMainDeck')
          .done(function(data) {
              if(data.lastcard != -1)
              {
                //Overwrite the card in the trashdeck
                newTrashCard = drawDeck.find('.card');
                trashDeck.empty();
                trashDeck.prepend(newTrashCard);
                card = $('<div class="card free ' + data.suit + '"><span class="value v1">' + data.val + '</span><span class="value v2">' + data.val + '</span></div>');

                //Gerum spilið drag/droppable
                initDragDrop(card);

                if(data.rank === "king")
                {
                  card.addClass('king');
                }
                else if(data.rank === "queen")
                {
                  card.addClass('queen');
                }
                else if(data.rank === "jack")
                {
                  card.addClass('jack');
                }

                //Bætum spilinu í drawdeck
                drawDeck.prepend(card);
              }
              else
              {
                ;;;window.console&&console.log( ['bled'] );
              }
            })
          .always(function() {
              $html.removeClass('ajax-wait');
            });*/
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
    $bdy.on('click', '.card', function (e) {
        var card = $(this),
            inPyramid = card.parents('.pyramid').length,
            cIndex = {
              i: parseInt(card.find('.i').text(), 10 ),
              j: parseInt(card.find('.j').text(), 10 )
            };

        if( inPyramid && checkKingPyr( cIndex.i, cIndex.j ) )
        {
          card.addClass('gone');
        }
        else if( false /*checkKingDeck( card.parents('.decks').length )*/ )
        {
          card.addClass('gone');
        }
      });

    //Initum öll spilin sem draggable og droppable sem eru í dominu.
    initDragDrop( $('.card') );
})($);