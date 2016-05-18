'use strict';

let request = require('request'); 
let geocoder = require('geocoder');
let filters = require('../helpers/filters');
let FoursquareApi = require('./FoursquareApi');
let foursquareApi = new FoursquareApi();

let WhatsGood = function () { };

WhatsGood.prototype.getGeolocation = function (place) {

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

// TODO: move this FoursquareApi
WhatsGood.prototype.getTrendingEvents = function (geometry, radius) {

    return new Promise(function (resolve, reject) {

        // TODO: consider passing a limit here
        request(foursquareApi.trending(geometry.lat, geometry.lng, radius), function (error, response, body) {
            
            if (!error && response.statusCode === 200) {
                let response = JSON.parse(body).response;
                let filteredVenues = response.venues.filter(venue => {
                    return filters.excludedCategories.indexOf(venue.categories[0].name) === -1;
                });

                response.venues = filteredVenues;
                resolve(response);

            } else {
                reject(err);
            }

        });
    });
}

module.exports = WhatsGood;
