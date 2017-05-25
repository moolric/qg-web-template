/*globals qg*/
(function ($, qg) {
    'use strict';
    var processXML = function (obj) {
        // file path
        var prepareUrl = function (loc) {
            var path = window.location.pathname;
            var pathArr = path.substr(0 , path.lastIndexOf('/')).split('/').filter(function (e) {
                return e;
            });
            return '/'+pathArr[pathArr.length-1]+loc;
        };

        // date format
        var convertDate =  function(inputFormat) {
            var dateObj = new Date(inputFormat);
            return [ dateObj.getDate(), dateObj.toString().slice(4,7), dateObj.getFullYear() ].join(' ');
        };

        // get XML data
        $.ajax({
            type: 'GET',
            url: prepareUrl(obj.file),
            dataType: 'xml',
            success: function(xml) {
                $('.qg-xml-content').append('<div id=\'news-item-aside\' class=\'news-items\'></div>');
                $(xml).find('entry').each(function(index) {
                    var $this = $(this);
                    var entry = {
                        title: $this.find('title').text(),
                        imgSrc: $this.find('summary').find('div').find('img').attr('src'),
                        desc: $this.find('summary').find('p').text(),
                        posted: $this.find('updated').text(),
                        url: $this.find('id').eq(0).text()
                    };
                    // template
                    $('#news-item-aside').append('<div class="section" id="news-entry-aside-section-'+index+'"> <a href="'+entry.url+'"> <img src="'+entry.imgSrc+'" alt=""/> </a> <h3>'+entry.title+'</h3> <div class="news-content"> <dl class="meta"> <dt class="date-posted">Posted</dt> <dd class="date-posted">'+convertDate(entry.posted)+'</dd> </dl> <p>'+entry.desc+'</p> <p class="more"> <a href="'+entry.url+'" title="Read more about: '+entry.title+'">More…</a> </p> </div> </div>');
                });
                // loading script after the ajax process
                $.getScript(qg.swe.paths.assets+'script/slideshow.js');
            }
        });
    };

    processXML({
        file : '/assets/data/featured/source.atom'
    });
}(jQuery, qg));
