'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var request = require('request');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
      sync();
    }
  });
};

function sync() {
  request.post('http://localhost:3000/api/instruments/greet',function(err,resp){
        console.log("Run");
        if(err)
        console.log(err);
        console.log(resp.body);
      })
  
  console.log(new Date());
}

setTimeout(sync, 60000);


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
