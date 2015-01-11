var express = require('express');
var router = express.Router();
var https = require('https');
var qs = require('querystring');
var fsquareReqOpts = require('../public/javascripts/foursquare-api.js');

router.route('/')
  .get(function(req, res) {
    res.render('index');
  })
  .post(function(req, res) {
    var latitude = req.body.latitude, //40.7463340
        longitude = req.body.longitude, //-73.9824640
        radius = '2000';

    https.get(fsquareReqOpts(latitude, longitude, radius), function(trending) {
      var body = '';

      trending.on('data', function(chunk) {
        body += chunk.toString();
      });

      trending.on('end', function() {
        res.format({
          'text/html': function() {
            res.render('index', JSON.parse(body).response);
          },

          'application/json': function() {
            res.send(body);
          },

          'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
          }
        });
      });

    }).on('error', function(e) {
      res.send(e.message);
    });
  })

module.exports = router;
