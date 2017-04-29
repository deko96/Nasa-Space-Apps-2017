var googleAPI = require('../../libs/googleapi');
var Logger = require('../../libs/logger');

var BeachesController = function() {

    /**
     * Get Beaches by Lat & Long
     */
    var getBeachesByCoords = function(lat, long, callback) {
        console.log(lat, long);
        return googleAPI.nearBySearch({
            location: [lat, long],
            types: "natural_feature",
            radius: 100000,
            keyword: 'beach OR плажа'
        }, function(error, response) {

            if (error) {
                return Logger.error('Something went wrong inside "getBeaches" function.. Please try again!');
            }

            callback(response);

        });

    };

    /**
     * Get Google Places Data
     */
    var getGoogleData = function(params, callback) {
        if (params.query !== 'undefined') {
            var searchOpt = {
                query: params.query,
                types: 'locality'
            };
            return googleAPI.textSearch(searchOpt, function(error, response) {
                if (error) {
                    return Logger.error('Something went wrong with the search..');
                }
                if (response.results.length > 0) {
                    return getBeachesByCoords(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng, function(data) {
                        callback(data);
                    });
                } else {
                    callback(null);
                }
            });
        }
    };

    this.getBeaches = function(req, res, next) {
        var params = req.query;

        if (typeof params.query === 'undefined' && (typeof params.lat === 'undefined' || typeof params.long === 'undefined')) {
            return next();
        } else {
            return getGoogleData(params, function(data) {
                res.json(data);
            });
        }
    };

};

module.exports = new BeachesController();