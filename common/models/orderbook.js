'use strict';
var async = require("async");
module.exports = function(Orderbook) {
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
    
    Orderbook.fetch = function (cb) {
        async.every(pairs, function (pair, callback) { 
            var filtered=[];
            orderBookService = Orderbook.app.dataSources.orderbook;
            orderBookService.cp(pair, 'orderBook', function (err, response, context) {
            if (err) throw err; //error making request
            if (response.error) {
                console.log('> response error: ' + response.error.stack);
            }
            // console.log(response.orderBook.buckets);

           

            // if(response.length>0){
            response.orderBook.buckets.forEach((bucket) => {
                if(bucket.price>response.orderBook.price*0.975)
                if(bucket.price<response.orderBook.price*1.025)
                {
                    filtered.push(bucket);
                }
            });

                Orderbook.upsertWithWhere({"instrument": response.orderBook.instrument},{
                    "instrument": response.orderBook.instrument,
                    "price":response.orderBook.price,
                    "time": response.orderBook.unixTime,
                    "bucketWidth": response.orderBook.bucketWidth,
                    "buckets": filtered});
                });
            // }});    
        });
        cb(null, 'Greetings... ');
    };
    Orderbook.remoteMethod('fetch', {
            // accepts:{arg:'pairs', type:'string'},
            returns: { arg: 'greeting', type: 'string' }
         });
    }
    