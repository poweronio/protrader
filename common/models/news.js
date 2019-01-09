'use strict';
var async = require("async");
module.exports = function(News) {
    var newsDataService;
var pairs = [
    'AUD_USD',
    'NZD_JPY',
    'GBP_CAD',
    'EUR_CHF'];

    News.fetch = function (cb) {
        async.every(pairs, function (pair, callback) { 
            newsDataService = News.app.dataSources.oanda1;
            newsDataService.cp(pair, 604800 , function (err, response, context) {
          if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
        if(response.length>0){
        response.forEach((newsItem) => {
            News.create({"timestamp": newsItem.timestamp,
                "title": newsItem.title,
                "impact": newsItem.impact||0,
                "currency": newsItem.currency});
        });
            }});
               
        
    });
    cb(null, 'Greetings... ');
};
    News.remoteMethod('fetch', {
        // accepts:{arg:'pairs', type:'string'},
        returns: { arg: 'greeting', type: 'string' }
     });


}
