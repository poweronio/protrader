'use strict';
var request = require("request");
module.exports = function (Currency) {
    const curl = new (require( 'curl-request' ))();
   
   
    Currency.getReqStream = function (cb) { 
        const options = {  
            url: 'https://stream-fxtrade.oanda.com/v3/accounts/001-001-1764820-001/pricing/stream?instruments=EUR_USD',
            method: 'GET',
            headers: {
                Authorization: 'Bearer 1fee90dedad1abc90df403870923132c-7ec28839c346f9fc989abbf08c23d99b'
            }
        };
        
        request(options, function(err, res, body) {  
            let json = JSON.parse(body);
            console.log(json);
            cb(null,"Stream");
        });

    }
    Currency.remoteMethod('getReqStream', {
        returns: { arg: 'getReqStream', type: 'string' }
      });
   
    Currency.getcURLStream = function (cb) { 
        curl.setHeaders(['Authorization: Bearer 1fee90dedad1abc90df403870923132c-7ec28839c346f9fc989abbf08c23d99b'])
        .get('https://stream-fxtrade.oanda.com/v3/accounts/001-001-1764820-001/pricing/stream?instruments=EUR_USD')
        .then(({statusCode, body, headers}) => {
            console.log(statusCode, body, headers);
        })
        .catch((e) => {
            console.log(e);
        });
        cb(null,"Stream");
    }


    Currency.remoteMethod('getcURLStream', {
        returns: { arg: 'getStream', type: 'string' }
      });

};
