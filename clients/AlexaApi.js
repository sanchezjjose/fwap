'use strict';

let WhatsGoodApi = require('./WhatsGoodApi');
let whatsGoodApi = new WhatsGoodApi();

let AlexaApi = function AlexaApi() {};

AlexaApi.prototype.getData = function (res, place, startPos, maxResults, intentName) {
    let self = this;

    return new Promise((resolve, reject) => {
        let outputSpeech = '';

        if (place) {
            whatsGoodApi.getGeolocation(place).then((geometry) => {
                whatsGoodApi.getTrendingEvents(geometry, '8000').then((response) => {
                    let venues = response.venues;

                    if (typeof venues === 'undefined' || venues.length <= 0) {
                        outputSpeech = 'Sorry, there is nothing good in your area at the moment.'

                    } else {
                        outputSpeech = self.getOutputSpeech(startPos, maxResults, venues, place, intentName);
                    }

                    resolve(outputSpeech);
                });
            });

        } else {
            outputSpeech = 'Please say the name of the city in your request. For example, ask whats good in los angeles.';
            resolve(outputSpeech);
        }
    });
}

AlexaApi.prototype.getOutputSpeech = function (startPos, maxResults, venues, place, intentName) {
    let outputSpeech = '';
    let endPos = startPos + maxResults;
    let totalNumResults = venues.length < endPos ? venues.length : maxResults;
    let venueNames = venues.slice(startPos, totalNumResults).map(venue => {
        return venue.name;
    }).join(',');

    switch (intentName) {
        case 'WhatsGoodIntent': {
            outputSpeech = `The top ${totalNumResults} things in ${place} are ${venueNames}`
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

    return outputSpeech;
}

AlexaApi.prototype.sendResponse = function (res, outputSpeech, shouldEndSession) {
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
                "title": "What's Good in the Hood.",
                "content": outputSpeech
            },
            "shouldEndSession": shouldEndSession
        }
    });
}

module.exports = AlexaApi;
