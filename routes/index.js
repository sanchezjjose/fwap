var express = require('express');
var router = express.Router();
var https = require('https');
var fsquareReqOpts = require('../public/javascripts/fsquareRequestOptions.js');


router.get('/', function(req, res) {

  if ( false ) {

    res.render('index-noresults');

  } else {

    // TODO: get these values from request object, returned by the client
    var latitude = '40.7463340';
    var longitude = '-73.9824640';
    var radius = '2000';

    https.get(fsquareReqOpts(latitude, longitude, radius), function(trending) {
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
  }
});

router.post('/test', function(req, res) {
  console.log('test!');
  console.log(req.params);
  console.log(res.params);

  res.render('index-noresults');
});

module.exports = router;
