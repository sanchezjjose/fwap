var express = require('express');
var router = express.Router();
var https = require('https');
var fsquare_options = require('../public/javascripts/foursquare-options');


/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.get('/json', function(req, res) {
  var jsonData = 'no data yet';
  https.get(fsquare_options, function(resp){
    resp.on('data', function(chunk){
      jsonData = chunk.toString();
    });
  }).on("error", function(e){
    jsonData = e.message;
  });

  res.json(jsonData);
});

module.exports = router;