'use strict';

let express = require('express');
let router = express.Router();
let https = require('https'); // replace this with 'q' or something promise based
let qs = require('querystring');
let geocoder = require('geocoder');
let request = require('request');

var filters = require('./filters');
let config = require('../public/js/config.js')();
let FoursquareApi = require('./FoursquareApi');
let foursquareApi = new FoursquareApi(config);

function getOutputSpeech(startPos, maxResults, venues, place) {
    let outputSpeech = '';
    let endPos = startPos + maxResults;
    let totalNumResults = venues.length < endPos ? venues.length : maxResults;

    let venueNames = venues.slice(startPos, totalNumResults).map(venue => {
        return venue.name;
    }).join(',');

    outputSpeech = `The top ${totalNumResults} things in ${place} are ${venueNames}`;

    return outputSpeech;
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

function getGeolocation(place) {
    return new Promise(function (resolve, reject) {
        geocoder.geocode(place, function (err, data) {
            if (!err) {
                if (data.results) {
                    resolve(data.results[0].geometry.location);
                } else {
                    resolve({});
                }
            } else {
                reject('Error occurred looking up geocode');
            }
        });
    });
}

function getTrendingEvents(geometry, radius) {
    return new Promise(function (resolve, reject) {
        // TODO: consider passing a limit here
        https.get(foursquareApi.trending(geometry.lat, geometry.lng, radius), function (trending) {
            let body = '';

            trending.on('data', function(chunk) {
                body += chunk.toString();
            });

            trending.on('end', function() {
                let bodyObj = JSON.parse(body);
                let venues = bodyObj.response.venues;

                resolve(venues);
            });
        }).on('error', function(err) {
            console.log(err);

            outputSpeech = 'Sorry, there was a problem getting what\'s good';
            reject(outputSpeech);
        });
    });
}

function getData(res, place, startPos, maxResults) {
    return new Promise(function (resolve, reject) {
        let outputSpeech = '';

        if (place) {

            // TODO: fix error case
            // TODO: maybe need async waterfall
            getGeolocation(place).then(function(geometry) {
                getTrendingEvents(geometry, '8000').then(function(venues) {

                    if (typeof venues === 'undefined' || venues.length <= 0) {
                        outputSpeech = 'Sorry, there is nothing good in your area at the moment.'

                    } else {
                        outputSpeech = getOutputSpeech(startPos, maxResults, venues, place);
                    }

                    resolve(outputSpeech);

                }).catch(function(err) {
                    console.log(err);

                    outputSpeech = 'Sorry, there was a problem getting what\'s good';
                    resolve(outputSpeech);
                });

            }).catch(function(err) {
                console.log(err);

                outputSpeech = 'Sorry, there was a problem getting what\'s good';
                resolve(outputSpeech);
            });

        } else {
            outputSpeech = 'Please say the name of the city in your request. For example, ask whats good in los angeles.';
            resolve(outputSpeech);
        }
    });
}

router.route('/alexa').post(function(req, res) {
    let outputSpeech = '';
    let intentType = req.body.request.type;

    let shouldEndSession = true;
    let startPos = 0;
    let maxResults = 5;

    if (intentType === 'LaunchRequest') {
        getData(res, shouldEndSession, place, startPos, maxResults);

    } else if (intentType === 'IntentRequest') {
        let intentName = req.body.request.intent.name;
        let slots = req.body.request.intent.slots;
        let place = slots && slots.City.value;

        switch (intentName) {
            case 'WhatsGoodIntent': {
                getData(res, place, startPos, maxResults).then(function(outputSpeech) {
                    sendResponse(res, outputSpeech, shouldEndSession);
                });
                break;
            }
            case 'WhatsReallyGoodIntent': {
                outputSpeech = 'Whats really good';
                break;
            }
            case 'WhatsReallyReallyGoodIntent': {
                outputSpeech = 'Whats really, really good';
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
});

module.exports = router;
