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
      news();
      // sync();
    }
  });
};

function sync() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'instruments/greet',function(err,resp){
        console.log("Run");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  
  console.log(new Date());
  setTimeout(sync, 60000);
  
}

function news() {
  var apiBase = app.get('url')+'api/';
  request.post(apiBase+'instruments/fetchNews',function(err,resp){
        console.log("Run");
        if(err)
        console.log(err);
        // console.log(resp.body);
        console.log(new Date());
      })
  
  console.log(new Date());
  setTimeout(news, 3600000);
}




// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
