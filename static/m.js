(function() {

var $ = jQuery,
    $bdy = $('body'),
    $html = $('html');

    //Bindum smell á stokk.
    $('.deck').on('click', function (e) {
        var link = $('<a href="deck.html">derp</a>');
        e.preventDefault();
        ;;;window.console&&console.log( ['mm'] );
        //
        $html.addClass('ajax-wait');
        $.get(
              link.attr('href')
            )
          .done(function(data) {
              ;;;window.console&&console.log( [data] );
              data = $(data);
              ;;;window.console&&console.log( [data.find('.card')] );
            })
          .always(function() {
              $html.removeClass('ajax-wait');
            });
    });

})($);