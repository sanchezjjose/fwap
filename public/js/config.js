
module.exports = function () {

  return {
    clientId: process.env.WG_FOURSQUARE_CLIENT_ID,
    clientSecret: process.env.WG_FOURSQUARE_CLIENT_SECRET,
    apiVersion: '20141210'
  };
};
