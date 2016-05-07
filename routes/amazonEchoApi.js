var express = require('express');
var router = express.Router();
var https = require('https');
var qs = require('querystring');
var config = require('../public/js/config.js')();
var Foursquare = require('../public/js/foursquare.js');

router.route('/test')
  .post(function(req, res) {
    res.json({
      "version": "1.0",
      "sessionAttributes": {
        "supportedHoriscopePeriods": {
          "daily": true,
          "weekly": false,
          "monthly": false
        }
      },
      "response": {
        "outputSpeech": {
          "type": "PlainText",
          "text": "Your wife, Paula is good. She is the best of all time."
        },
        "card": {
          "type": "Simple",
          "title": "Horoscope",
          "content": "Today will provide you a new learning opportunity.  Stick with it and the possibilities will be endless."
        },
        // "reprompt": {
        //   "outputSpeech": {
        //     "type": "PlainText",
        //     "text": "Can I help you with anything else?"
        //   }
        // },
        "shouldEndSession": true
      }
    });
  });

module.exports = router;
