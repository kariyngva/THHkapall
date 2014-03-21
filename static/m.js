(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
    trashDeck = $('.trashdeck'),

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
      };


    //Bindum smell á stokk.
    drawDeck.on('click.drawDeck', function (e) {
        var link = $('<a href="deck.html">derp</a>');

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
                card = $('<div class="card ' + data.suit + '"><span class="value">' + data.rank + '</span></div>');

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

$(document).ready(function () {

    var $elements = $('.card');
    var cardDragged;
    var cardDroppedOn;


    $('.card')
      .draggable({
        scope: 'card',
        revert: 'invalid',
        //snap: true,
        drag: function () {


          },
        start: function (event, ui) {
          var card = $(this),
              cardIndex = {
                  i: parseInt( card.find('.i').text(), 10 ),
                  j: parseInt( card.find('.j').text(), 10 )
                },
              canMoveCard = isFree( cardIndex.i, cardIndex.j )

          //Stop a card from being dragged if it's not free
          //Should always be at the bottom so we don't prematurly return
          ;;;window.console&&console.log( [isFree( cardIndex.i, cardIndex.j )] );
          if( !isFree( cardIndex.i, cardIndex.j ) )
          {
            return false;
          }
          /*if( !$(this).is('.free') )
          {
            return false;
          }
          cardDragged = $(this);*/
          },

        stop: function (event, ui) {
          ;;;window.console&&console.log( ['stop'] );
          //when
            if($('.drawDeck').find('.card').length === 0){
              ;;;window.console&&console.log( ['drawdeck empty'] );
              drawDeck.trigger('click');
            }
          }
      });

     $('.card')
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
            ;;;window.console&&console.log( ['drop'] );
            $(this).css("border-color", "lightgreen")
            isFree()
            //check
            cardDroppedOn = $(this);
            ;;;window.console&&console.log( [$(this)] );

        },
        over: function (event, ui) {
            $(this).css("border-color", "blue")
        },
        out: function (event, ui) {
            $(this).css("border-color", "pink")
            ;;;window.console&&console.log( ['out'] );
        }
      });
    /*$(".card").draggable({
        axis: "x, y",
        containment: "parent"
        drag: function (ev, ui) {
            var xPos, $elem,
            deltaX = ui.position.left - ui.originalPosition.left;
            for (var i in $elements) {
                $elem = $elements[i];
                if ($elem[0] != this) {
                    $elem.offset({
                        top: $elem.data('dragStart').top,
                        left: Math.max($elem.data('dragStart').left + deltaX, 8)
                    });
                }
            }
        }
    });*/
    /*$(".Event").resizable({
        //containment: "parent",
        handles: 'e, w'
    });
    $(".Resource").resizable({
        //containment: "parent",
        handles: 'e, w'
    });*/
});


})($);