
module.exports = function (latitude, longitude, radius) {

	// TODO: hide this
	var clientId = '***REMOVED***';
	var clientSecret = '***REMOVED***';
	var version = '***REMOVED***';

	return {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/trending?ll=' + latitude + ',' + longitude + '&radius=' + radius + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&v=' + version,
    method: 'GET',
    headers: { 'Transfer-Encoding' :'chunked' }
  };
};