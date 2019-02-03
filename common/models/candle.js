'use strict';
const zlib = require('zlib');
var async = require("async");
var request = require("request");
var groupArray = require('group-array');

module.exports = function(Candle) {
    var app = require('../../server/server');
    var candleDataService;
    var granularity = ["H3", "H2", "M30", "M5", "M1"];
    var majors = [
        "AUD_USD",
        "AUD_JPY",
        "EUR_USD",
        "EUR_JPY",
        "GBP_USD",
        "GBP_JPY",
        "USD_JPY",
        "USD_CHF",
        "NZD_USD",
        "NZD_JPY"     
  
  ];

  var minors = [
    "AUD_CAD",
    "NZD_CAD",
    "GBP_CAD",
    "EUR_AUD",
    "CAD_JPY",
  ];

  var supp = [
    "EUR_CHF",
    "EUR_GBP",
    "USD_CAD",
    "GBP_CHF",
  ]


};
