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
    var latitude = req.body.latitude,
        longitude = req.body.longitude,
        radius = req.body.radius || '5000'; // meters => approximately 3 miles

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
