app.controller('TableCtrl', ['$scope', '$timeout', '$http', 'Instrument', 'Pair', '$filter',function ($scope, $timeout, $http, Instrument, Pair,$filter) {
  //    var http = require('http');
  //var https = require('https');
  $scope.candleData = {
    c: 0,
    o: 0,
    h: 0,
    l: 0,
    time: 0,
    color: ''
  };
  $scope.candles;
  var options = {
    headers: {
      "Authorization": "Bearer 1fee90dedad1abc90df403870923132c-7ec28839c346f9fc989abbf08c23d99b",
      "Connection": "Keep-Alive"
    },
    url: 'http://localhost:3000/api/currencies/instruments/GBP_USD?tf=H3',
    method: 'GET'
  };
  var options1 = {
    headers: {
      "Authorization": "Bearer 1fee90dedad1abc90df403870923132c-7ec28839c346f9fc989abbf08c23d99b",
      "Connection": "Keep-Alive"
    },
    url: 'https://api-fxtrade.oanda.com/v3/instruments/EUR_JPY/candles?smooth=true&count=15&price=M&granularity=M30',
    method: 'GET'
  };

  var news = {
    url: 'https://cdn-nfs.faireconomy.media/ff_calendar_thisweek.json',
    method: 'GET'
  }

  $scope.currentTime = new Date().getTime()/1000;

  


 /* function assembleData(candle) {
    $scope.candles.push(candle);
  }

  function getColors(candles) {
    $scope.candles = [];
    for (var i = 0; i < candles.length; i++) {
      var candleData = {
        c: candles[i].mid.c,
        o: candles[i].mid.o,
        h: candles[i].mid.h,
        l: candles[i].mid.l,
        time: candles[i].time,
        color: (candles[i].mid.c - candles[i].mid.o >= 0) ? "BLUE" : "RED"
      };

      assembleData(candleData);
    }
  }

  function getAction() {
    var i = $scope.candles.length - 1;
    var actionColor = $scope.candles[i].color;
    var actionClose = $scope.candles[i].c;
    var actionIndex = 0;
    var actionOpen = 0;

    // var anchorColor = actionColor=="RED"?"BLUE":"RED";
    // var anchorClose = 0;
    // var anchorOpen =0;

    while ($scope.candles[i].color == actionColor) {
      actionOpen = $scope.candles[i].o;
      actionIndex = i;
      console.log(i);
      i--;
    }
    if (actionOpen > 0) {
      $scope.action = {
        index: actionIndex,
        c: actionClose,
        o: actionOpen,
        color: actionColor,
        size: Math.abs(actionClose - actionOpen)
      }
    }
  }

  function getAnchor() {
    var anchorColor = $scope.action.color == "RED" ? "BLUE" : "RED";
    var anchorClose = $scope.action.o;
    var anchorIndex = $scope.action.index - 1;
    var i = anchorIndex;
    var anchorOpen = 0;
    while ($scope.candles[i].color == anchorColor) {
      anchorOpen = $scope.candles[i].o;
      anchorIndex = i;
      console.log(i);
      i--;
    }
    if (anchorOpen > 0) {
      $scope.anchor = {
        index: anchorIndex,
        c: anchorClose,
        o: anchorOpen,
        color: anchorColor,
        size: Math.abs(anchorClose - anchorOpen)

      }
    }
  }

  function getAux1() {
    var auxColor = $scope.action.color;
    var auxClose = $scope.anchor.o;
    var auxIndex = $scope.anchor.index - 1;
    var i = auxIndex;
    var auxOpen = 0;

    console.log("Starting at: " + i);
    console.log(auxColor);

    while ($scope.candles[i].color == auxColor) {
      auxOpen = $scope.candles[i].o;
      auxIndex = i;
      console.log(i);
      i--;
    }

    if (auxOpen > 0) {
      $scope.aux1 = {
        index: auxIndex,
        c: auxClose,
        o: auxOpen,
        color: auxColor,
        size: Math.abs(auxClose - auxOpen)
      }
    }
  }

  function getAux2() {
    var auxColor = $scope.anchor.color;
    var auxClose = $scope.aux1.c;
    var auxIndex = $scope.aux1.index - 1;
    var i = auxIndex;
    var auxOpen = 0;

    console.log("Starting at: " + i);
    console.log(auxColor);

    while ($scope.candles[i].color == auxColor) {
      auxOpen = $scope.candles[i].o;
      auxIndex = i;
      console.log(i);
      i--;
    }

    if (auxOpen > 0) {
      $scope.aux2 = {
        index: auxIndex,
        c: auxClose,
        o: auxOpen,
        color: auxColor,
        size: Math.abs(auxClose - auxOpen)
      }
    }
  }*/

  function getTrend() {
    var direction = $scope.action.color == "RED" ? "DOWN" : "UP";
    var _direction = direction == "DOWN" ? "UP" : "DOWN";

    // ****** ****** ****** ******** ****** ****** ******//
    // ****** ****** ****** SIDEWAYS ****** ****** ******//
    // ****** ****** ****** ******** ****** ****** ******//
    if ($scope.anchor.size < $scope.aux1.size) {
      console.log("SIDEWAYS");
      var direction = $scope.action.color == "RED" ? "DOWN" : "UP";
      if ($scope.action.size < $scope.anchor.size) {
        console.log("BIAS " + direction);
      } else if ($scope.action.size >= $scope.anchor.size) {
        console.log("BIAS " + direction + " CONFIRMED");
      }
    } else
      // ****** ****** ***** ****** ******//
      // ****** ****** TREND ****** ******//
      // ****** ****** ***** ****** ******// 
      if ($scope.anchor.size >= $scope.aux1.size) {
        console.log("TREND IS ");
        // ****** ****** ****** ******** ****** ****** ******//
        // ****** ****** ANCHOR BREAK *** ****** ******//
        // ****** ****** ****** ******** ****** ****** ******//
        if ($scope.action.size >= $scope.anchor.size) {
          console.log(_direction + "TREND N.S ANCHOR BREAK");
        }

        // ****** ****** ****** ****** ******//
        // ****** ***** NO SETUP ***** ******//
        // ****** ****** ****** ****** ******//
        else if ($scope.aux2 <= $scope.aux1) {
          console.log("TREND IS " + direction + " N.S");
        }
        // ****** ****** ****** ****** ******//
        // ****** ******  SETUP ****** ******//
        // ****** ****** ****** ****** ******//

        else if ($scope.aux2 > $scope.aux1) {
          console.log("TREND IS " + direction + " SETUP");
        }
      }
  }

  $scope.options = {
    chart: {
        type: 'candlestickBarChart',
        height: 350,
        margin : {
            top: 20,
            right: 20,
            bottom: 50,
            left: 60
        },
        x: function(d){ return d['time']; },
        y: function(d){ return d['close']; },
        duration: 30,
        
        xAxis: {
            axisLabel: 'Time',
           /* tickFormat: function(d) {
                return d3.time.format('%x')(new Date(d));
            },
            showMaxMin: false*/
        },

        yAxis: {
            axisLabel: 'Rate',
            tickFormat: function(d){
                return '$' + d3.format(',.4f')(d);
            },
            showMaxMin: false
        },
        zoom: {
            // enabled: true,
            // scaleExtent: [1, 10],
            useFixedDomain: false,
            useNiceScale: false,
            horizontalOff: true,
            verticalOff: true,
            unzoomEventType: 'dblclick.zoom'
        }
    }
};

$scope.dataH3 =[];
$scope.dataH2 =[];
$scope.dataM30 =[];
// {values: [  {"date": 15854, "open": 165.42, "high": 165.8, "low": 164.34, "close": 165.22, "volume": 160363400, "adjusted": 164.35},  {"date": 15856, "open": 165.37, "high": 166.31, "low": 163.13, "close": 163.45, "volume": 176850100, "adjusted": 162.59}]}];


function getTimeStamp(longDate){
  var shorterDate = longDate.replace('T',' ');
  var evenShorterDate = shorterDate.replace('-','/');
  var unixtimestamp = (new Date(evenShorterDate)).getTime() / 1000;
  console.log(shorterDate);
  console.log(evenShorterDate);
  console.log(unixtimestamp);
  return unixtimestamp;
}

$scope.greaterThan = function(prop, val){
  return function(item){
    return item[prop] > val;
  }
}


function updateDurations() {
  $scope.updated -=1;
  if(new Date().getDay()>4&&new Date().getHours()>17&&new Date().getDay!=7){
  $scope.updated = 0;
  } else
  $timeout(updateDurations, 1000, true);

};
// updateDurations();    


  function init() {
    $scope.racetrack = null;
    $scope.updated = 60;
    Instrument.find({}, function (list) {
      $scope.racetrack = [];
      $scope.pairs = list;
      // console.log($scope.currentTime);
      // console.log(list);
      for(var i=0;i<list.length;i++){
        var rtm30 = $filter('filter')(list[i].candlesM30, {rt:true});
        var rth2 = $filter('filter')(list[i].candlesH2, {rt:true});
        var rth3 = $filter('filter')(list[i].candlesH3, {rt:true});
        $scope.racetrack.push({rth3,rth2,rtm30});
      }

    });
    if((new Date().getDay()==5)&&(new Date().getHours()>17)||(new Date().getDay==6)||(new Date().getDay()==7)&&(new Date().getHours()<17)){
    console.log("offline");
    }else
    {
      // $timeout(init, 60000,true);
    }

  }  

  init();

  $scope.updateCharts = function (_index){
    console.log(_index);
    $scope.dataH3, $scope.dataH2,$scope.dataM30 =null;
    var candleArrayH3= $scope.pairs[_index].candlesH3.map(function (candleData,index) {
      var obj = {
          time: index/2,//candleData.time.substring(5,16),
          open: candleData.o,
          high: candleData.h,
          low: candleData.l,
          close: candleData.c,
          color: candleData.c - candleData.o > 0 ? "BLUE" : "RED",
          size:Math.abs(candleData.c - candleData.o)
        }
      return (obj);
    });
    $scope.dataH3=[];
    $scope.dataH3.push({values:candleArrayH3});
    var candleArrayH2= $scope.pairs[_index].candlesH2.map(function (candleData,index) {
      var obj = {
          time: index/2,//candleData.time.substring(5,16),
          open: candleData.o,
          high: candleData.h,
          low: candleData.l,
          close: candleData.c,
          color: candleData.c - candleData.o > 0 ? "BLUE" : "RED",
          size:Math.abs(candleData.c - candleData.o)
        }
      return (obj);
    });
    $scope.dataH2=[];
    $scope.dataH2.push({values:candleArrayH2});
    var candleArrayM30= $scope.pairs[_index].candlesM30.map(function (candleData,index) {
      var obj = {
          time: index/2,//candleData.time.substring(5,16),
          open: candleData.o,
          high: candleData.h,
          low: candleData.l,
          close: candleData.c,
          color: candleData.c - candleData.o > 0 ? "BLUE" : "RED",
          size:Math.abs(candleData.c - candleData.o)
        }
      return (obj);
    });
    $scope.dataM30=[];
    $scope.dataM30.push({values:candleArrayM30});
  }

  

}]);

