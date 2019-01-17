'use strict';
var async = require("async");
module.exports = function(News) {
    var newsDataService;
var pairs = [
    'EUR_USD',
    'NZD_JPY',
    'GBP_CAD',
    'AUD_CHF'];

    // 3600 - 1 hour
    // 43200 - 12 hour
    // 86400 - 1 day
    // 604800 - 1 week
    // 2592000 - 1 month
    // 7776000 - 3 months
    // 15552000 - 6 months
    // 31536000 - 1 year

    News.fetch = function (cb) {
        async.every(pairs, function (pair, callback) { 
            newsDataService = News.app.dataSources.oanda1;
            newsDataService.cp(pair, 86400 , function (err, response, context) {
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
