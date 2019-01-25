'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var request = require('request');

var app = module.exports = loopback();
var apiBase = app.get('url')+'api/';


app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      if(new Date().getDay()>4&&new Date().getHours()>17&&new Date().getDay!=7)
      {
            console.log("Market Closed");
      }
      else {
        console.log("Market OPEN");
        // sync();
      }
      
      sync();
      // getStream();
      // news();
      // orderBook();
    }
    app.setMaxListeners(30)
  });
};

app.post('/curl-out', function (req, res) {
  console.log("BOOM");
  app.emit('testEvent');
  return res.status(200).end();
});




function sync() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'instruments/greet',function(err,resp){
    setTimeout(last, 15000);
    // last()
        console.log("RUN");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  console.log("50 CANDLE SYNC");
  console.log(new Date());
   
  
}

function last() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'instruments/latest',function(err,resp){
        console.log("LAST");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
      console.log("1 CANDLE SYNC");
  console.log(new Date());
  setTimeout(last, 10000);
  
}

function news() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'news/fetch',function(err,resp){
        console.log("Run Server News");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  
  console.log(new Date());
  // setTimeout(news, 3600000);
}
function orderBook() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'orderbook/fetch',function(err,resp){
        console.log("Run orderbook");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  
  console.log(new Date());
  // setTimeout(news, 3600000);
}


function getStream() {

  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'instruments/getStream',function(err,resp){
        console.log("Run Stream");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  
  console.log(new Date());
  // setTimeout(news, 3600000);
}




// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
