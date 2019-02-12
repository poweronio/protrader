app.controller('TableCtrl', ['$scope', '$timeout', '$http', 'Instrument', 'News', '$filter',function ($scope, $timeout, $http, Instrument, News,$filter) {
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
        duration: 20,
        
        xAxis: {
            axisLabel: 'Time',
            tickFormat: function(d) {
                return d3.time.format('%a %d %I:%M')(new Date(d*1000));
            },
            showMaxMin: false
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
            // useFixedDomain: false,
            // useNiceScale: true,
            horizontalOff: true,
            verticalOff: true,
            unzoomEventType: 'dblclick.zoom'
        }
    }
};

$scope.dataH3 =[];
$scope.dataH2 =[];
$scope.dataM30 =[];

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

$scope.getCurrency = function(name,nb){
  var array = name.split('_');
    return array[0];
}


function updateDurations() {
  $scope.updated -=1;
  if(new Date().getDay()>4&&new Date().getHours()>17&&new Date().getDay!=7){
  $scope.updated = 0;
  } else
  $timeout(updateDurations, 1000, true);

};
updateDurations();    

function syncFromCSV(){
  $http.get('eco_cal.json').then(function(data){
    var news = data.data;
    for (var i=0;i<news.length;i++){
      News.create({
        impact:news[i].impact,
        timestamp:new Date(news[i].timestamp).getTime()/1000,
        title:news[i].title,
        currency:news[i].currency
      });
    }
    console.log(data.data);
  },function(err){
    console.log(err);
  });
}

News.find(
  {filter:{
    where:{
      impact:{gt:1},
      timestamp:{gt:new Date().getTime()/1000},
      timestamp:{lt:new Date().getTime()/1000 + 86400},
    }}}, function(nlist){
  console.log(nlist);
  $scope.news = nlist;
});
  function init() {
    $scope.racetrack = null;
    $scope.updated = 60;
    console.log(new Date().getTime()/1000);
    console.log(new Date().getTime()/1000+86400);
   
    Instrument.find({filter:{fields:{
      'name':true,
      'heatmap':true,
      'class':true,
      'butter':true,
      "pip":true,
      "price":true,
      "trendH3":true,
      "trendH2":true,
      "trendM30":true,
      "trendM5":true,
      "trendM1":true,
      "candlesM30":true,
      "candlesH2":true,
      "candlesH3":true

    }}}, function (list) {
      $scope.racetrack = [];
      $scope.pairs = list;
      // console.log($scope.currentTime);
      console.log(list);
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
      $timeout(init, 60000,true);
    }

  }  

  init();

  $scope.updateCharts = function (row){
    $scope.focus = row;
     console.log(row);
    $scope.dataH3 =null;
    $scope.dataH2 =null;
    $scope.dataM30 =null;
    $scope.dataM5 =null;
    $scope.dataM1 =null;
    $scope.dataH3 = [];
    $scope.dataH2 = [];
    $scope.dataM30 = [];
    $scope.dataM5 = [];
    $scope.dataM1 = [];
    $scope.dataH3.push({values:row.chartH3});
    $scope.dataH2.push({values:row.chartH2});
    $scope.dataM30.push({values:row.chartM30});
    $scope.dataM5.push({values:row.chartM5});
    $scope.dataM1.push({values:row.chartM1});
    
    
  }

  

}]);

