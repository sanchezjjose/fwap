var config = require('./config.js')();

module.exports = function (latitude, longitude, radius) {

  // TODO: hide this
  var clientId = config.clientId;
  var clientSecret = config.clientSecret;
  var version = config.apiVersion;

  return {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/trending?ll=' + latitude + ',' + longitude + '&radius=' + radius + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + version,
    method: 'GET',
    headers: { 'Transfer-Encoding' :'chunked' }
  };
};