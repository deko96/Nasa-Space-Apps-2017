var googleAPI = require('../../libs/googleapi');
var Logger = require('../../libs/logger');

var BeachesController = function() {

    /**
     * Get Beaches
     */
    var getBeachesResults = function(params, callback) {
        if (params.query !== 'undefined') {
            var searchOpt = {
                query: params.query + ' beaches'
            };
            return googleAPI.textSearch(searchOpt, function(error, response) {
                if (error) {
                    Logger.error(error);
                    return callback({
                        status: 500,
                        message: 'Google Responded with an Error message. Please try again!'
                    });
                }
                if (response.results.length > 0) {
                    return callback(response);
                } else {
                    callback(null);
                }
            });
        }
    };

    /**
     * Router Function (/getBeaches)
     */
    this.getBeaches = function(req, res, next) {
        var params = req.query;

        if (typeof params.query === 'undefined' && (typeof params.lat === 'undefined' || typeof params.long === 'undefined')) {
            return next();
        }
        return getBeachesResults(params, function(data) {
            res.json(data);
        });
    };

};

module.exports = new BeachesController();