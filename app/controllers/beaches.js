var googleAPI = require('../../libs/googleapi');
var Logger = require('../../libs/logger');
var Request = require('request-promise');
var BeachesController = function() {
    /**
     * Get elevation point
     */
    var EPBaseURL = "https://maps.googleapis.com/maps/api/elevation/json";
    var getElevation = function(data, array, callback) {

        if (data.length == array.length) {
            return callback(array);
        }
        i = array.length;

        var beach = {
            name: data[i].name,
            rating: data[i].rating,
            location: {
                latitude: data[i].location.latitude,
                longtitude: data[i].location.longtitude
            }
        };
        Request({
                uri: EPBaseURL,
                type: "GET",
                qs: {
                    key: googleAPI.API_KEY,
                    locations: data[i].location.latitude + "," + data[i].location.longtitude
                },
                json: true,
            })
            .then(function(elevationData) {
                if (elevationData.status == "OK") {
                    beach.elevation = elevationData.results[0].elevation;
                    beach.resolution = elevationData.results[0].resolution;
                    array.push(beach);
                }

                return getElevation(data, array, callback);

            })
            .catch(function(err) {
                console.log(err);
                callback({
                    status: 'error',
                    message: 'Something is wrong with Google Elevation Search API, please try again later.',
                });
            });

    };

    /**
     * Get Images for Beaches
     */
    var getImages = function(data, parsedArray, callback) {

        if (data.length == parsedArray.length) {
            return callback(parsedArray);

        }

        var i = parsedArray.length;
        var params = {};
        if (typeof data[i].photos !== 'undefined') {
            var params = {
                photoreference: data[i].photos[0].photo_reference || null
            };
        }

        var beach = {
            name: data[i].name,
            rating: data[i].rating,
            location: {
                latitude: data[i].geometry.location.lat,
                longtitude: data[i].geometry.location.lng
            }
        };

        if (params.photoreference) {

            googleAPI.imageFetch(params, function(error, response) {

                if (error) {
                    Logger.error(error);
                    return callback({
                        status: 500,
                        message: 'Google Responded with an Error message. Please try again!'
                    });
                }

                beach['photo'] = response;
                parsedArray.push(beach);
                return getImages(data, parsedArray, callback);
            });

        } else {
            parsedArray.push(beach);
            return getImages(data, parsedArray, callback);
        }


    };

    /**
     * Get City Name by Coords
     */
    var getCityName = function(coords, callback) {

        if (typeof coords.lat === 'undefined' || typeof coords.long === 'undefined') {
            return callback(null);
        }
        var searchParam = {
            location: [coords.lat, coords.long],
            type: 'locality'
        };
        return googleAPI.placeSearch(searchParam, function(err, response) {
            if (err) {
                return console.log(err);
            }
            if (response.results.length > 0) {
                console.log(response.results);
                return callback(response.results[0].name);
                //
            } else {
                return callback({
                    status: 204,
                    message: 'No places were found.',
                });
            }
        });

    };

    /**
     * Get Beaches
     */
    var getBeachesResults = function(params, callback) {
        if (typeof params.query !== 'undefined') {
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
                    getImages(response.results, [], function(result) {
                        return callback(result);
                    });

                } else {
                    return callback({
                        status: 204,
                        message: 'No beaches were found.'
                    });
                }
            });
        } else if (typeof params.lat !== 'undefined' && typeof params.long !== 'undefined') {
            return getCityName({
                lat: params.lat,
                long: params.long
            }, function(data) {
                if (data) {
                    getBeachesResults({
                        query: data
                    }, callback);
                } else {
                    return callback({
                        status: 204,
                        message: "No beaches were found."
                    });
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
            if (data.status && data.status !== 200) {
                return res.status(data.status).json(data);
            }
            // console.log(data);
            getElevation(data, [], function(sendData) {
                res.json(sendData);
            });
            // return res.json(data);
        });
    };

};

module.exports = new BeachesController();