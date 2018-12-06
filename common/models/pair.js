'use strict';

module.exports = function(Pair) {
  var candleDataService;
  var granularity = ["H3", "H2", "M30", "M10", "M5", "M1"];

  Pair.afterInitialize = function () {
    candleDataService = Pair.app.dataSources.oanda;
    Pair.find({}, function (err, list) {
      console.log(list);
    });
  };

  

  Pair.greet = function (cb) {
    candleDataService.instruments("EUR_USD", "H3", function (err, response, context) {
      if (err) throw err; //error making request
      if (response.error) {
        console.log('> response error: ' + response.error.stack);
      }
      console.log(response);
      console.log('> candles fetched successfully from remote server');
    });
    cb(null,'Greetings... ');
  }

  Pair.remoteMethod('greet', {
    returns: { arg: 'greeting', type: 'string' }
  });

};
