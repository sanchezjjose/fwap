'use strict';

let express = require('express');
let router = express.Router();

let WhatsGoodApi = require('./WhatsGoodApi');
let whatsGoodApi = new WhatsGoodApi();

router.route('/')

    .get(function(req, res) {
        res.render('index');
    })

    .post(function(req, res) {
        let radius = req.body.radius || '4800'; // meters => approximately 3 miles
        let geometry = {
            lat : req.body.latitude,
            lng : req.body.longitude
        };

        whatsGoodApi.getTrendingEvents(geometry, radius).then(function(response) {

            res.format({
                'text/html': function() {
                    res.render('index', response);
                },

                'application/json': function() {
                    res.send(response);
                },

                'default': function() {
                    res.status(406).send('Not Acceptable');
                }
            });

        }).catch(function(err) {
            res.send(err.message);
        });
    })

module.exports = router;
