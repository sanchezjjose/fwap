'use strict';

let express = require('express');
let router = express.Router();
let AlexaApi = require('../clients/AlexaApi');
let alexaApi = new AlexaApi();

router.route('/alexa').post(function(req, res) {
    let outputSpeechProblem = 'Sorry, there was a problem getting what\'s good';
    let intentType = req.body.request.type;

    let shouldEndSession = true;
    let startPos = 0;
    let maxResults = 5;

    if (intentType === 'LaunchRequest') {
        alexaApi.getData(res, shouldEndSession, place, startPos, maxResults).then(function(outputSpeech) {
            alexaApi.sendResponse(res, outputSpeech, shouldEndSession);

        }).catch(function(err) {
            console.log(err);
            alexaApi.sendResponse(res, outputSpeechProblem, shouldEndSession);
        });

    } else if (intentType === 'IntentRequest') {
        let intentName = req.body.request.intent.name;
        let slots = req.body.request.intent.slots;
        let place = slots && slots.City.value;

        alexaApi.getData(res, place, startPos, maxResults, intentName).then(function(outputSpeech) {
            alexaApi.sendResponse(res, outputSpeech, shouldEndSession);

        }).catch(function(err) {
            console.log(err);
            alexaApi.sendResponse(res, outputSpeechProblem, shouldEndSession);
        });

    } else {
        console.log(`The intent ${intentType} was not recognized.`);
    }
});

module.exports = router;
