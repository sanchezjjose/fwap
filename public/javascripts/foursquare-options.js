
module.exports = function () {
	return {
    host: 'api.foursquare.com',
    port: 443,
    path: '/v2/venues/trending?ll=40.7463340,-73.9824640&radius=2000&client_id=***REMOVED***&client_secret=***REMOVED***&v=***REMOVED***',
    method: 'GET',
    headers: { 'Transfer-Encoding' :'chunked' }
  };
};