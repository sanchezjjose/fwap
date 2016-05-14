'use strict';

let express = require('express');
let router = express.Router();
let https = require('https');

let WhatsGoodApi = require('./WhatsGoodApi');
let whatsGoodApi = new WhatsGoodApi();

router.route('/')

    .get(function(req, res) {
        res.render('index');
    })

    .post(function(req, res) {

        let geomatry = {
            lat : req.body.latitude,
            lng : req.body.longitude
        };

        let radius = req.body.radius || '4800'; // meters => approximately 3 miles

        https.get(fs.trending(latitude, longitude, radius), function(trending) {
            var body = '';

            trending.on('data', function(chunk) {
                body += chunk.toString();
            });

            trending.on('end', function() {
                let response = JSON.parse(body).response;
                let filteredVenues = response.venues.filter(venue => {
                    return filters.excludedCategories.indexOf(venue.categories[0].name) === -1;
                });

                response.venues = filteredVenues;

                res.format({
                    'text/html': function() {
                        res.render('index', response);
                    },

                    'application/json': function() {
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
    })

module.exports = router;
