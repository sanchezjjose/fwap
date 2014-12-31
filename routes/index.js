var express = require('express');
var router = express.Router();
var https = require('https');
var fsquareOpts = require('../public/javascripts/foursquare-options');


router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.get('/trending', function(req, res) {
  https.get(fsquareOpts(), function(checkins) {
    var body = '';

    checkins.on('data', function(chunk) {
      body += chunk.toString();
    });

    checkins.on('end', function() {
      res.format({
        'text/html': function(){
          res.render('trending', JSON.parse(body));
        },

        'application/json': function(){
          res.send(body);
          res.end();
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