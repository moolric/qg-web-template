define([
    'jquery',
    'underscore',
    'jqueryUI'
], function(
    $,
    _
) {
    $.fn.extend({
        expando: function(node) {

            var table = $('<table/>').appendTo($(this));

            $.each(node,function(name, child) {
                var tr = $('<tr/>')
                    .appendTo(table)
                ;

                var td = $('<td/>').attr('valign','top').appendTo(tr);

                var img;
                if (_.isObject(child)) {
                    img = $('<img/>').attr('src',$.qgcidm.config.home+'/image/expandoClosed.png').appendTo(td);
                }
                else {
                    img = $('<img/>').attr('src',$.qgcidm.config.home+'/image/property.png').appendTo(td);
                }

                var td = $('<td/>').appendTo(tr);

                var a = $('<span/>').addClass('property_name').append($('<stong>').text(name)).appendTo(td);

                if (! _.isObject(child)) {
                    $('<span/>').text(': ').appendTo(td);
                    $('<span/>').addClass('property_value').text(child).appendTo(td);
                }

                if (_.isArray(child)) {
                    $('<span/>').text('['+child.length+']').appendTo(td);
                }

                tr = $('<tr/>').appendTo(table);
                $('<td/>').appendTo(tr);

                var div = $('<div/>')
                    .addClass('opml').appendTo($('<td/>').attr('valign','bottom').appendTo(tr));

                // start closed
                $(div).hide();

                $(img).click(function() {
                    $(div).toggle();
                    if ($(div).is(':visible')) {
                        $(img).attr('src',$.qgcidm.config.home+'/image/expandoOpen.png')
                    }
                    else {
                        $(img).attr('src',$.qgcidm.config.home+'/image/expandoClosed.png')
                    }
                });

                if (_.isObject(child)) {
                    $(div).expando(child);
                }

            });


        }
    });

    return $;

});