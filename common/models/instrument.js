'use strict';
var async = require("async");
var request = require("request");
var groupArray = require('group-array');

module.exports = function (Instrument) {
  var candleDataService;
  var newsDataService;
  var orderbookService;
  //Instrument.setId("1");
  var granularity = ["H3", "H2", "M30", "M10", "M5", "M1"];
  var trendTf = ["H3", "H2", "M30"];
  var pairs = ["EUR_USD", "GBP_USD", "EUR_JPY", "GBP_JPY","USD_JPY"];

  //var i = 1;
  

  Instrument.afterInitialize = function () {
  };

  Instrument.observe('before save', function (ctx, next) {
    //console.log(ctx.currentInstance);
  next();
  });

  function getTrend(pair,tf) {
    var trend = "";
    
      var action = "action" + tf;
      var anchor = "anchor" + tf;
      var anchorTrend = "anchorTrend" +tf;
      var aux1 = "aux1" + tf;
      var aux2 = "aux2" + tf;
      var direction = pair[action].color == "RED" ? "DOWN" : "UP";
      var _direction = direction == "DOWN" ? "UP" : "DOWN";
      if (pair[anchor].size < pair[aux1].size) {
        if (pair[action].size < pair[anchor].size) {
          trend = "SIDEWAYS BIAS " + direction;
        } else {
          trend = "SIDEWAYS BIAS " + direction + " CONFIRMED";
        }
      }
      else 
       
       if (pair[action].size < pair[anchor].size) {
      if (pair[anchorTrend].color == pair[anchor].color) {
        trend = _direction + "TREND SETUP"
      } else trend = direction + "TREND N.S";
    } else if (pair[anchorTrend].color == pair[anchor].color) {
      trend = _direction + "TREND ANCHOR BREAK";
    }else {
      trend = direction + "TREND N.S";
     }
      
      pair.updateAttribute("trend" + tf, trend);
    
  };
  
  function getAux2(instrument, tf, candleData, count) {
    var aux2Color = candleData[count].color;
    var aux2Close = candleData[count].c;
    var aux2Index = 0;
    var aux2Open = 0;
    async.whilst(
      function () { return candleData[count].color == aux2Color; },
      function (callback) {
        aux2Open = candleData[count].o;
        aux2Index = count;
        count--;
        callback(null, count);
      }, function (err, n) {
        instrument.updateAttribute("aux2" + tf, { index: aux2Index, c: aux2Close, o: aux2Open, color: aux2Color, size: Math.abs(aux2Close - aux2Open) });
        getTrend(instrument, tf);
      });

  }

  function getAux(instrument, tf, candleData, count) {
    var auxColor = candleData[count].color;
    var auxClose = candleData[count].c;
    var auxIndex = 0;
    var auxOpen = 0;
    async.whilst(
      function () { return candleData[count].color == auxColor; },
      function (callback) {
        auxOpen = candleData[count].o;
        auxIndex = count;
        count--;
        callback(null, count);
      }, function (err, n) {
        instrument.updateAttribute("aux1" + tf, { index: auxIndex, c: auxClose, o: auxOpen, color: auxColor, size: Math.abs(auxClose - auxOpen) });
        getAux2(instrument, tf, candleData, count);
      });

  }

  Number.prototype.between = function (a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
  };

  function getAnchorTrend(instrument, tf, candleData, anchorIndex, anchorOpen, anchorClose) {    
    async.whilst(
      function () { 
        return (anchorIndex-1>0)&&(!parseFloat(anchorOpen).between(candleData[anchorIndex-1].o, candleData[anchorIndex-1].c) && !parseFloat(anchorClose).between(candleData[anchorIndex-1].o, candleData[anchorIndex-1].c))},

      function (callback) {
        anchorIndex--;
        callback(null, anchorIndex);
      }, function (err, n) {
        instrument.updateAttribute("anchorTrend" + tf, { index: anchorIndex-1, color: candleData[anchorIndex-1].color});
      });

  }

  function getAnchor(instrument, tf, candleData, count) {
    var anchorColor = candleData[count].color;
    var anchorClose = candleData[count].c;
    var anchorIndex = 0;
    var anchorOpen = 0;
    async.whilst(
      function () { return candleData[count].color == anchorColor; },
      function (callback) {
        anchorOpen = candleData[count].o;
        anchorIndex = count;
        count--;
        callback(null, count);
      }, function (err, n) {
        instrument.updateAttribute("anchor" + tf, { index: anchorIndex, c: anchorClose, o: anchorOpen, color: anchorColor, size: Math.abs(anchorClose - anchorOpen) });
        getAux(instrument, tf, candleData, count);
        getAnchorTrend(instrument, tf, candleData, anchorIndex, anchorOpen, anchorClose);
      });

  }

  function getAction(instrument, tf, candleData) {
    var action = {};
    var actionColor = candleData[candleData.length - 1].color;
    var actionClose = candleData[candleData.length - 1].c;
    var actionIndex = 0;
    var actionOpen = 0;
    var count = candleData.length - 1;
    async.whilst(
      function () { return candleData[count].color == candleData[candleData.length - 1].color; },
      function (callback) {
        actionOpen = candleData[count].o;
        actionIndex = count;
        count--;
        callback(null, count);
      }, function (err, n) {
        instrument.updateAttribute("action" + tf, { index: actionIndex, c: actionClose, o: actionOpen, color: actionColor, size: Math.abs(actionClose - actionOpen) });
        getAnchor(instrument, tf, candleData, count);
      });
   
  }

  function getHeatmap(instrument, tf, candleLast, candleStart){
    // var getHeatmap = candleLast - candleStart;
    instrument.updateAttribute("heatmap",(candleLast - candleStart)*instrument.pip );
  }

  function getButter(instrument, tf, candleData){
   var price = candleData;
   var butter={
     daily:false,
     htf:false,
     itf:false,
     stf:false
    }
   var daily = false;
   var htf = false;
   var itf = false;
   var stf = false;

  price= candleData>10?candleData*100:candleData*10000;
  if((price%1000>250)&&(price%1000<750)){
    butter.daily = true;
  }

  if((price%250>75)&&(price%250<175)){
    butter.htf = true;
  }
  if((price%100>25)&&(price%100<75)){
    butter.itf = true;
  }

  if((price%25>5)&&(price%25<20)){
    butter.stf = true;
  }
  
  instrument.updateAttribute("butter", butter);
  }

  Instrument.greet = function (cb) {
    async.every(pairs, function (pair, callback) { 
      var data = {
        M1: [],
        M5: [],
        M10: [],
        M30: [],
        H2: [],
        H3: []           
      };
      Instrument.findOne({ where: { name: pair } }, function (err, instrument) {
        newsDataService = Instrument.app.dataSources.oanda1;
        newsDataService.cp(pair, 86400, function (err, response, context) {
          if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
          instrument.updateAttribute("news",response);
        });
        orderbookService = Instrument.app.dataSources.orderbook;
        orderbookService.cp(pair, 'orderBook', function (err, response, context) {
          if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
            console.log(response);
          instrument.updateAttribute("orderbook",response);
        });
        async.every(granularity, function (tf, callback) {
          candleDataService = Instrument.app.dataSources.oanda;
          candleDataService.cp(pair, tf, function (err, response, context) {
            if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
            if(tf=='M1'){
              getButter(instrument,tf,response.candles[response.candles.length-1].mid.c); 
              getHeatmap(instrument,tf,response.candles[response.candles.length-1].mid.c,response.candles[0].mid.c); 
            }
            data[tf]= response.candles.map(function (candleData) {
              var obj = {
                time: candleData.time,
                l: candleData.mid.l,
                o: candleData.mid.o,
                c: candleData.mid.c,
                h: candleData.mid.h,
                color: candleData.mid.c - candleData.mid.o > 0 ? "BLUE" : "RED",
                size:Math.abs(candleData.mid.c - candleData.mid.o)*instrument.pip,
                rt:(Math.abs(candleData.mid.c - candleData.mid.o)*instrument.pip)>30?true:false
              }
              return (obj);
            });
            
            instrument.updateAttribute("candles"+tf, data[tf] );
            getAction(instrument, tf, data[tf]);
            //console.log(groupArray(data[tf], 'color'));
            callback(null, data);
          });
        }, function (err, result) {
          //instrument.updateAttribute("candle", data);
          
        });

      });
    });
    cb(null, 'Greetings... ');
  };

  Instrument.remoteMethod('greet', {
    returns: { arg: 'greeting', type: 'string' }
  });

};
