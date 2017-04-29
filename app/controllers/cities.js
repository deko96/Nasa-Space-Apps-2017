var googleAPI = require('../../libs/googleapi');
var Logger = require('../../libs/logger');

var CitiesController = function() {

    /**
     * Get Cities
     */
    var getCityResults = function(query, callback) {
        if (typeof query === 'undefined' || query === null || query.length < 3) {
            return callback(null);
        }
        var params = {
            input: query
        };
        return googleAPI.placeAutocomplete(params, function(error, response) {
            if (error) {
                Logger.error(error);
                return callback({
                    status: 500,
                    message: 'Google Responded with an Error message. Please try again!'
                });
            }
            callback(response);
        });
    };

    /**
     * Router Function (/getCities)
     */
    this.getCities = function(req, res, next) {
        var query = req.query.query;

        if (typeof query === 'undefined' || query === null) {
            return next();
        }

        return getCityResults(query, function(data) {
            res.json(data);
        });
    };

};

module.exports = new CitiesController();