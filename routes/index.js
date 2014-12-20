var express = require('express');
var router = express.Router();
var https = require('https');


/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
});

router.get('/json', function(req, res) {
  var options = {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/trending?ll=34.0522340,-118.2436850&radius=2000&client_id=***REMOVED***&client_secret=***REMOVED***&v=***REMOVED***'
  };

  https.get(options, function(resp){
    resp.on('data', function(chunk){
      var data = chunk.toString();

      console.log("YEP");
      console.log(chunk.toString());
    });
  }).on("error", function(e){
    console.log("Got error: " + e.message);
  });

  res.json({ message: 'hooray! welcome to our api!' });
});

module.exports = router;