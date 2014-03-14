(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html'),
    drawDeck = $('.drawdeck'),
    trashDeck = $('.trashdeck');

    //Bindum smell á stokk.
    drawDeck.on('click', function (e) {
        var link = $('<a href="deck.html">derp</a>');

        //passa að láta click + drag cancela click event.
        //e.preventDefault();

        $html.addClass('ajax-wait');
        $.get('http://localhost:8080/drawFromDeck')
          .done(function(data) {
              if(data.lastcard == true)
              {

              }
              else
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


})($);