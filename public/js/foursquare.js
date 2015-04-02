
var Foursquare = function(config) {
  this.clientId = config.clientId;
  this.clientSecret = config.clientSecret;
  this.apiVersion = config.apiVersion;
};

Foursquare.prototype.trending = function(latitude, longitude, radius) {
  return {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/trending?ll=' + latitude + ',' + longitude + '&radius=' + radius + '&client_id=' + this.clientId + '&client_secret=' + this.clientSecret + '&v=' + this.apiVersion,
    method: 'GET',
    headers: { 'Transfer-Encoding' :'chunked' }
  };
};

module.exports = Foursquare;