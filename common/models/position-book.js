'use strict';
var async = require("async");
module.exports = function(Positionbook) {
    var orderBookService;
    
    var pairs = [
        "AUD_USD",
        "AUD_JPY",
        "NZD_USD",
        "GBP_USD",
        "GBP_JPY",
        "EUR_USD",
        "EUR_JPY",
        "USD_CHF",
        "USD_JPY",
        "USD_CAD",
        "EUR_CHF",
        "GBP_CHF",
        "EUR_GBP"
        // "GBP_CAD",
        // "EUR_CAD",
        // "CAD_CHF",
        // "NZD_JPY",
        // "NZD_CAD",
        // "CAD_JPY",
        // "AUD_CAD"     
    ];
    
    Positionbook.fetch = function (cb) {
        async.every(pairs, function (pair, callback) { 
            var filtered=[];
            orderBookService = Positionbook.app.dataSources.orderbook;
            orderBookService.cp(pair, 'positionBook', function (err, response, context) {
            if (err) throw err; //error making request
            if (response.error) {
                console.log('> response error: ' + response.error.stack);
            }
            Positionbook.upsertWithWhere({"instrument": response.positionBook.instrument},{
                    "instrument": response.positionBook.instrument,
                    "price":response.positionBook.price,
                    "time": response.positionBook.unixTime,
                    "bucketWidth": response.positionBook.bucketWidth,
                    "buckets": response.positionBook.buckets});
                });
            // }});    
        });
        cb(null, 'Greetings... ');
    };
    Positionbook.remoteMethod('fetch', {
            // accepts:{arg:'pairs', type:'string'},
            returns: { arg: 'greeting', type: 'string' }
         });
};
