(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html');

    //Bindum smell á stokk.
    $('.deck').on('click', function (e) {
        var link = $('<a href="deck.html">derp</a>');
        //e.preventDefault();

        $html.addClass('ajax-wait');
        $.get(
              //link.attr('href')
              'deck.html'
            )
          .done(function(data) {
              res = $(data);
              ;;;window.console&&console.log( [res] );
            })
          .always(function() {
              $html.removeClass('ajax-wait');
            });
    });

})($);