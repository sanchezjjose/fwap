'use strict';

let Foursquare = function () {
    this.clientId = process.env.WG_FOURSQUARE_CLIENT_ID;
    this.clientSecret = process.env.WG_FOURSQUARE_CLIENT_SECRET;
    this.apiVersion = '20141210';
};

Foursquare.prototype.trending = function (latitude, longitude, radius) {

    return {
        url: `https://api.foursquare.com/v2/venues/trending?ll=${latitude},${longitude}&radius=${radius}&client_id=${this.clientId}&client_secret=${this.clientSecret}&v=${this.apiVersion}`,
        headers: { }
    };
};

module.exports = Foursquare;
