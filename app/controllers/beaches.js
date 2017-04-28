var googleAPI = require('../../libs/googleapi');

var BeachesController = function() {

    /**
     * Get Google Places Data
     */
    var parseGoogleData = function(lat, long) {
        console.log(googleAPI);
        return googleAPI;
    };

    this.getBeaches = function(req, res, next) {
        var params = req.query;

        if (!params.lat || !params.long) {
            return next();
        } else {
            return res.send(parseGoogleData(params.lat, params.long));
        }
    };

};

module.exports = new BeachesController();