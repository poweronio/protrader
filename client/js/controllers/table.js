app.controller('TableCtrl', ['$scope', '$timeout', '$http', 'Instrument', 'Pair', function ($scope, $timeout, $http, Instrument, Pair) {
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
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 66,
            left: 60
        },
        x: function(d){ return d['date']; },
        y: function(d){ return d['close']; },
        duration: 30,
        
        xAxis: {
            axisLabel: 'Dates',
            tickFormat: function(d) {
                return d3.time.format('%x')(new Date(d.replace('-','/')));
            },
            showMaxMin: false
        },

        yAxis: {
            axisLabel: 'Stock Price',
            tickFormat: function(d){
                return '$' + d3.format(',.1f')(d);
            },
            showMaxMin: false
        },
        zoom: {
            enabled: true,
            scaleExtent: [1, 10],
            useFixedDomain: false,
            useNiceScale: false,
            horizontalOff: false,
            verticalOff: true,
            unzoomEventType: 'dblclick.zoom'
        }
    }
};

$scope.data =[];
// {values: [  {"date": 15854, "open": 165.42, "high": 165.8, "low": 164.34, "close": 165.22, "volume": 160363400, "adjusted": 164.35},  {"date": 15856, "open": 165.37, "high": 166.31, "low": 163.13, "close": 163.45, "volume": 176850100, "adjusted": 162.59}]}];



  function init() {
    Instrument.find({}, function (list) {
      $scope.pairs = list;
      console.log(list);
      var candleArray= list[0].candlesM5.map(function (candleData) {
        var obj = {
            time: candleData.time.replace('T',' '),
            open: candleData.o,
            high: candleData.h,
            low: candleData.l,
            close: candleData.c,
            color: candleData.c - candleData.o > 0 ? "BLUE" : "RED",
            size:Math.abs(candleData.c - candleData.o)
          }
        return (obj);
      });
      $scope.data.push({values:candleArray});
      console.log($scope.data);
    });
  }  
    /*  getAction();
      getAnchor();
      getAux1();
      getAux2();
      getTrend();*/
    
  
  
   /* $http(options).then(function (res) {
      console.log("Connected");
      $scope.rowCollectionBasic = res.data.candles;
      getColors(res.data.candles);
      getAction();
      getAnchor();
      getAux1();
      getAux2();
      getTrend();
    });
    $http(options1).then(function (res) {
      console.log("Connected 1");
      $scope.rowCollectionBasic = res.data.candles;
      getColors(res.data.candles);
      getAction();
      getAnchor();
      getAux1();
      getAux2();
      getTrend();
    }); */
  //}

  init();

  $scope.removeRow = function (row) {
    var index = $scope.rowCollectionBasic.indexOf(row);
    if (index !== -1) {
      $scope.rowCollectionBasic.splice(index, 1);
    }
  };

  $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
  $scope.selectedPredicate = $scope.predicates[0];

  var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
  var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
  var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
  var id = 1;

  function generateRandomItem(id) {

    var firstname = firstnames[Math.floor(Math.random() * 3)];
    var lastname = lastnames[Math.floor(Math.random() * 3)];
    var birthdate = dates[Math.floor(Math.random() * 3)];
    var balance = Math.floor(Math.random() * 2000);

    return {
      id: id,
      firstName: firstname,
      lastName: lastname,
      birthDate: new Date(birthdate),
      balance: balance
    }
  }

  $scope.rowCollection = [];

  for (id; id < 5; id++) {
    $scope.rowCollection.push(generateRandomItem(id));
  }

  //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
  $scope.displayedCollection = [].concat($scope.rowCollection);

  //add to the real data holder
  $scope.addRandomItem = function addRandomItem() {
    $scope.rowCollection.push(generateRandomItem(id));
    id++;
  };

  //remove to the real data holder
  $scope.removeItem = function (row) {
    var index = $scope.rowCollection.indexOf(row);
    if (index !== -1) {
      $scope.rowCollection.splice(index, 1);
    }
  }

  //  pagination
  $scope.itemsByPage = 10;

  $scope.rowCollectionPage = [];
  for (var j = 0; j < 200; j++) {
    $scope.rowCollectionPage.push(generateRandomItem(j));
  }

  // pip
  var promise = null;
  $scope.isLoading = false;
  $scope.rowCollectionPip = [];
  $scope.getPage = function () {
    $scope.rowCollectionPip = [];
    for (var j = 0; j < 20; j++) {
      $scope.rowCollectionPip.push(generateRandomItem(j));
    }
  }

  $scope.callServer = function getData(tableState) {
    //here you could create a query string from tableState
    //fake ajax call
    $scope.isLoading = true;

    $timeout(function () {
      $scope.getPage();
      $scope.isLoading = false;
    }, 2000);
  };

  $scope.getPage();

}]);

