'use strict';
var async = require("async");
var pair_name = "EUR_USD";

module.exports = function(Pair) {
  var newsDataService;
  //pair.setId("1");
  var granularity = ["H3", "H2", "M30", "M10", "M5", "M1"];

  Pair.afterInitialize = function () {
    
   
  };

  

  Pair.greet = function (cb) {
    newsDataService = Pair.app.dataSources.oanda1;
    newsDataService.cp("EUR_USD", 604800, function (err, response, context) {
      if (err) throw err; //error making request
        if (response.error) {
          console.log('> response error: ' + response.error.stack);
        }
        cb(null,response);
    });
    /*async.every(granularity, function (tf, callback) {
      newsDataService = Pair.app.dataSources.oanda1;
      newsDataService.pairs(pair_name, tf, function (err, response, context) {
        if (err) throw err; //error making request
        if (response.error) {
          console.log('> response error: ' + response.error.stack);
        }
        console.log(response);

        //pair.updateAttribute({ name: tf, value: response.candles });

       Pair.upsertWithWhere({ where: { "name": "EUR_USD" } }, { tf: response.candles }, function (err, result) {
           console.log(err);
         console.log(result);
        });
        
        console.log('> candles fetched successfully from remote server');
      });
    }, function (err, result) {
      console.log(result);
      console.log("DONE");
    });
    
    cb(null,'Greetings... ');*/
  }

  Pair.remoteMethod('greet', {
    returns: { arg: 'response', type: 'array' }
  });

};
