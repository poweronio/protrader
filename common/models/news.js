'use strict';
var async = require("async");
module.exports = function(News) {
    var newsDataService;
    

    News.fetch = function (instruments, cb) {
        console.log("In News");
        async.every(instruments, function (instrument, callback) { 
            newsDataService = News.app.dataSources.oanda1;
            newsDataService.cp(instrument, 86400 , function (err, response, context) {
          if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
        //   instrument.updateAttribute("news",response);
        console.log(response);
        if(response.length>0){{}}
        response.forEach((newsItem) => {
            News.create({"timestamp": newsItem.timestamp,
                "title": newsItem.title,
                "impact": newsItem.impact,
                "currency": newsItem.currency});
        });
            });
               
        cb(null, 'Greetings... ');
    });

    News.remoteMethod('fetch', {
        accepts:{arg:'instruments', type:['string']},
        returns: { arg: 'greeting', type: 'string' }
     });

};
}
