'use strict';
const zlib = require('zlib');
var async = require("async");
var request = require("request");
var groupArray = require('group-array');
var app = require('../../server/server');

// var Koa = require('koa');
// var bodyParser = require('koa-bodyparser');

module.exports = function (Instrument) {
  var candleDataService;
  var newsDataService;
  var orderbookService;
  //Instrument.setId("1");
  var granularity = ["H3", "H2", "M30", "M5", "M1"];
  var pairs = ["EUR_USD", "GBP_USD", "EUR_JPY", "GBP_JPY","USD_JPY"];
  var tH3,tM30,tM5,tM1 =[];
  var tcandles=0;
  var tcandleData, hcandleData, jcandleData=[];

  //var i = 1;
  

  Instrument.afterInitialize = function () {
  };

  Instrument.observe('before save', function (ctx, next) {
    //console.log(ctx.currentInstance);
  next();
  });

  function getTrend(instrument,tf, tcandleData) {
    var trend = "";
    var refTrend = "trendState"+tf;
      var action = tcandleData[0];
      var anchor = tcandleData[1];
      var anchorTrend = "anchorTrend" +tf;
      var aux1 = tcandleData[2];
      var aux2 = tcandleData[3];
      var direction = action.color == "RED" ? "DOWN" : "UP";
      var _direction = direction == "DOWN" ? "UP" : "DOWN";
      if (anchor.size < aux1.size) {
        if (action.size < anchor.size) {
          trend = "SIDEWAYS BIAS " + direction;
        } else {
          trend = "SIDEWAYS BIAS " + direction + " CONFIRMED";
        }
      }
      else       
       if (action.size < anchor.size) {
      if (instrument[anchorTrend].color == anchor.color) {
        trend = _direction + "TREND SETUP"
      } else trend = direction + "TREND N.S";
    } else if (instrument[anchorTrend].color == anchor.color) {
      trend = _direction + "TREND ANCHOR BREAK";
    }else {
      trend = direction + "TREND N.S";
     }
      
      instrument.updateAttribute("trend" + tf, trend);
    
  };

  Number.prototype.between = function (a, b) {
    var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
    return this > min && this < max;
  };

  function getAnchorTrend(instrument, tf, candleData, anchorIndex, anchorOpen, anchorClose, tcandleData) {    
    async.whilst(
      function () { 
        return (anchorIndex-1>0)&&(!parseFloat(anchorOpen).between(candleData[anchorIndex-1].o, candleData[anchorIndex-1].c) && !parseFloat(anchorClose).between(candleData[anchorIndex-1].o, candleData[anchorIndex-1].c))},
      function (callback) {
        anchorIndex--;
        callback(null, anchorIndex);
      }, function (err, n) {
        instrument.updateAttribute("anchorTrend" + tf, { index: anchorIndex-1, color: candleData[anchorIndex-1].color},getTrend(instrument,tf,tcandleData));
        // instrument.updateAttribute("anchorTrend" + tf, { index: anchorIndex-1, color: candleData[anchorIndex-1].color});
      });

  }

  function getTrendCandles(instrument,tf,candleData,count,iterations){
   tcandleData=[];
    async.whilst(
      function(){return iterations>-1},
      function(callback){
        var candleColor = candleData[count].color;
        var candleClose = candleData[count].c;
        var candleIndex = 0;
        var candleOpen = 0;
        async.whilst(
         function () { return candleData[count].color == candleColor; },
         function (callback) {
           candleOpen = candleData[count].o;
           candleIndex = count;
           count--;
           callback(null, count);
         }, function (err, n) {
           tcandleData.push({index:candleIndex,c:candleClose,o:candleOpen,color:candleColor,size:Math.abs(candleClose-candleOpen)});
           });
        iterations--;
        callback(null,iterations);
      }, function(err,n){
        instrument.updateAttribute("trendState"+tf,tcandleData, getAnchorTrend(instrument,tf,candleData,tcandleData[1].index,tcandleData[1].o,tcandleData[1].c, tcandleData));
      });
    
  }

  function getHeatmap(instrument, tf, candleLast, candleStart){
    // var getHeatmap = candleLast - candleStart;
    instrument.updateAttribute("heatmap",{change:Math.abs((candleLast - candleStart)*instrument.pip),color:candleLast-candleStart>0?'BLUE':'RED'});
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

  function getHTFSD(instrument,tf,candleData){

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
        // newsDataService.cp(pair, 604800, function (err, response, context) {
        newsDataService.cp(pair, 86400, function (err, response, context) {
          // console.log(response);
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
        var orderBook = response;
        instrument.updateAttribute("orderbook",response.orderBook.buckets);
        });
        async.every(granularity, function (tf, callback) {
          var rtlength = 40;
          candleDataService = Instrument.app.dataSources.oanda;
          candleDataService.cp(pair, tf, function (err, response, context) {
            if (err) throw err; //error making request
            if (response.error) {
              console.log('> response error: ' + response.error.stack);
            }
            if(tf=='M1'){
              instrument.updateAttribute("price", response.candles[response.candles.length-1].mid.c);
              getButter(instrument,tf,response.candles[response.candles.length-1].mid.c); 
              getHeatmap(instrument,tf,response.candles[response.candles.length-1].mid.c,response.candles[0].mid.c); 
            }
            if(tf=='H3'){
              getHTFSD(instrument,tf,response.candles);
            }
            data[tf]= response.candles.map(function (candleData) {
              if(tf=="H3"){
                rtlength=50;
              }else if(tf=="H2"){
                rtlength=40;
              }else if(tf=="M30"){
                rtlength=25;
              }
              var obj = {
                time: new Date(candleData.time).getTime()/1000,
                l: candleData.mid.l,
                o: candleData.mid.o,
                c: candleData.mid.c,
                h: candleData.mid.h,
                color: candleData.mid.c - candleData.mid.o > 0 ? "BLUE" : "RED",
                size:Math.abs(candleData.mid.c - candleData.mid.o)*instrument.pip,
                rt:(Math.abs(candleData.mid.c - candleData.mid.o)*instrument.pip)>rtlength?true:false
              }
              return (obj);
            });

            tcandles=3;
            instrument.updateAttribute("candles"+tf, data[tf]);
            getTrendCandles(instrument,tf,data[tf],data[tf].length-1,3);

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


  Instrument.fetchNews = function (cb) {
    Instrument.find({fields:{name:true,id:true}}, function(err,pairs){
      var apiBase = app.get('url')+'api/';
      request.post(apiBase+'news/fetch',pairs,function(err,resp){
            console.log("Run Instrument Fetch News");
            if(err)
            console.log(err);
            // console.log(resp.body);
            console.log(new Date());
          })
cb(null,"Greeters");
    })
  }

  Instrument.remoteMethod('fetchNews', {
    returns: { arg: 'fetchNews', type: 'string' }
  });

};
