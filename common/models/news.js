'use strict';
var async = require("async");
module.exports = function(News) {
    var newsDataService;
    

    News.fetch = function (pairs, cb) {
        console.log(pairs);
        async.every(pairs, function (pair, callback) { 
            newsDataService = News.app.dataSources.oanda1;
            newsDataService.cp(pair, 86400 , function (err, response, context) {
          if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
        //   instrument.updateAttribute("news",response);
        console.log(response);
        });
            });
               
        cb(null, 'Greetings... ');
    };

    News.remoteMethod('fetch', {
        accepts:{arg:'pairs', type:['string']},
        returns: { arg: 'greeting', type: 'string' }
     });

};
