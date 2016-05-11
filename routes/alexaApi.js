'use strict';

let express = require('express');
let router = express.Router();
let https = require('https');
let qs = require('querystring');
let config = require('../public/js/config.js')();
let Foursquare = require('../public/js/foursquare.js');

function getOutputSpeech(startPos, numResults, venues) {
    let outputSpeech = '';
    let endPos = startPos + numResults;

    // TODO: use .map and build from a range (ie, 0,4 or 5,9 or 10,14 etc...)

    for (var i = startPos; i < endPos; i++) {
        outputSpeech += venues[i].name;
    
        if (i < endPos-1) {
            outputSpeech += ',';
        }
    }

    return `The top ${numResults} things in your area are ${outputSpeech}`;
}

function printDebug(req, res) {
    console.log('BODY');
    console.log(req.body);
    console.log('HEADERS');
    console.log(req.headers);
    console.log('=================');
}

function sendResponse(res, outputSpeech, shouldEndSession) {

    res.json({
        "version": "1.0",
        "sessionAttributes": {},
        "response": {
            "outputSpeech": {
                "type": "PlainText",
                "text": outputSpeech
            },
            "card": {
                "type": "Simple",
                "title": "What's Good in your Hood.",
                "content": outputSpeech
            },
            "shouldEndSession": shouldEndSession
        }
    });
}

router.route('/alexa').post(function(req, res) {
    let outputSpeech = '';
    let shouldEndSession = true;
    let intentType = req.body.request.type;

    let fs = new Foursquare(config);
    let latitude = '40.757481999999996';
    let longitude = '-73.9307194';
    let radius = '8000';
    let numResults = 5;

    printDebug(req, res);

    https.get(fs.trending(latitude, longitude, radius), function(trending) {
        let body = '';

        trending.on('data', function(chunk) {
            body += chunk.toString();
        });

        trending.on('end', function() {
            let bodyObj = JSON.parse(body);
            let venues = bodyObj.response.venues;
            let startPos = 0;
            let numResults = 5;

            if (typeof venues === 'undefined' || venues.length <= 0) {
                outputSpeech = 'Sorry, there is nothing good in your area at the moment.'
          
            } else if (intentType === 'LaunchRequest') {
                outputSpeech = getOutputSpeech(startPos, numResults, venues);

            } else if (intentType === 'IntentRequest') {
                let intentName = req.body.request.intent.name;
            
                switch (intentName) {
                    case 'WhatsGoodIntent': {
                        outputSpeech = getOutputSpeech(startPos, numResults, venues);
                        break;
                    }
                    case 'AMAZON.StopIntent': {
                        outputSpeech = 'Stopped. You no longer wish to hear what\'s good';
                        break;
                    }
                    case 'AMAZON.CancelIntent': {
                        outputSpeech = 'Stopped. You no longer wish to hear what\'s good';
                        break;
                    }
                    case 'AMAZON.HelpIntent': {
                        outputSpeech = 'You can ask, what\'s good in the hood to hear the top 5 things good in your area. ' + 
                        'Or, you can ask what\'s really good, to hear the next 5 things good in your area. ' +
                        'Or, you can ask what\'s really, really good, to hear 5 more things good in your area.'
                        break;
                    }
                    default: {
                        outputSpeech = 'Invalid intent. Ending session.'
                    }
                }

            } else {
                console.log(`The intent ${intentType} was not recognized.`);
            }

            sendResponse(res, outputSpeech, shouldEndSession);
        });

    }).on('error', function(err) {
        console.log(err);

        sendResponse(res, 'Sorry, there was a problem getting what\'s good', shouldEndSession);
    });
});

module.exports = router;
