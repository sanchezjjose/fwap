var express = require('express');
var router = express.Router();
var https = require('https');
var fsquareOpts = require('../public/javascripts/foursquare-options');


router.get('/', function(req, res) {
	https.get(fsquareOpts(), function(trending) {
    var body = '';

    trending.on('data', function(chunk) {
      body += chunk.toString();
    });

    trending.on('end', function() {
      res.format({
        'text/html': function(){
          res.render('index', JSON.parse(body).response);
        },

        'application/json': function(){
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
});

module.exports = router;