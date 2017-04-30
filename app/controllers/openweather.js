var openWeatherAPI = require('../../libs/openweather');
var logger = require('../../libs/logger');
var rp = require("request-promise");
var base64 = require('node-base64-image');
var openWeatherModule = require('openweather-apis');
openWeatherModule.setAPPID(openWeatherAPI.API_KEY);
openWeatherModule.setLang('en');

var OpenWeatherController = function() {
    var baseUviURL = "http://api.openweathermap.org/v3/uvi/";
    var baseLFURL = "http://api.openweathermap.org/data/2.5/forecast";
    var baseMapURL = "http://tile.openweathermap.org/map/";
    var mapLayers = ['clouds', 'precipitation_new', 'pressure_new', 'wind_new', 'temp_new'];

    var base64_encode = function(url, cb) {
        var options = { string: true };
        base64.encode(url, options, function(err, img) {
            if (err) {
                return console.log(err);
            }
            cb(img);
        });
    }

    /**
     * Get map conditions layer
     */
    var getMapLayers = function(data, cb) {
        var coords = data.coord;
        var lat = coords.lat;
        var long = coords.lon;
        data.mapLayers = [];
        mapLayers.forEach(function(e, i) {
            var uri = baseMapURL + e + "/" + "3/" + lat + "/" + long + ".png?appid=" + openWeatherAPI.API_KEY;
            data.mapLayers.push(uri.trim());
        });
        return cb(data);
    }

    /**
     * Get the forecast for the next days/hours
     */
    var getLaterForecast = function(data, cb) {
        var coords = data.coord;
        rp({
            uri: baseLFURL,
            type: 'GET',
            qs: {
                lat: coords.lat,
                lon: coords.lon,
                cnt: 10,
                appid: openWeatherAPI.OWM_API_KEY,
                units: 'metric',
            }
        })

        .then(function(aheadData) {

                var parsedData = JSON.parse(aheadData);
                if (parsedData.list.length > 0) {
                    parsedData.list.splice(0, 1);
                    data.laterForecast = parsedData.list;
                } else {
                    data.laterForecast = 'undefined';
                }

                getMapLayers(data, cb);

            })
            .catch(function(err) {
                console.log(err);
                cb({
                    status: 'error',
                    message: 'Something went wrong with the OpenWeather API !',
                });
            });

    }

    /**
     * Get the uvIndex data for the given coords
     */
    var getUv = function(data, getObj, cb) {

        rp(getObj)

        .then(function(uvData) {
            uvData = JSON.parse(uvData);
            if (typeof uvData !== 'undefined')
                data.uvIndex = uvData.data;
            else
                data.uvIndex = 'undefined';
            getLaterForecast(data, cb);
        })

        .catch(function(err) {
            logger.error('Something went wrong with the OpenWeather API !');
            return {
                status: 'error',
                message: 'Something went wrong with the OpenWeather API !'
            }
        });
    }

    /**
     * Main export function which gathers/calls all the data/functions needed
     */
    this.getWeather = function(req, res, next) {
        if (typeof req.query !== 'undefined') {
            var lat = req.query.lat,
                long = req.query.long;

            if ((typeof lat !== 'undefined' && typeof long !== 'undefined') && (lat.trim() !== '' && long.trim() !== '')) {

                lat = parseFloat(lat).toFixed(1);
                long = parseFloat(long).toFixed(1);
                var uvIndexURI = baseUviURL + parseInt(lat) + "," + parseInt(long) + "/current.json?appid=" + openWeatherAPI.API_KEY;
                var getObj = {
                    uri: uvIndexURI,
                    type: "GET",
                    simple: true,
                };

                openWeatherModule.setCoordinate(lat, long);
                openWeatherModule.getAllWeather(function(err, data) {
                    if (!err) {

                        return getUv(data, getObj, function(finalData) {
                            res.json(finalData);
                        });
                    } else {
                        logger.error('Something went wrong with the OpenWeather API !');
                        return res.json({
                            status: 'error',
                            message: 'Something went wrong with the OpenWeather API !'
                        });
                    }
                });
            } else {
                logger.error('[Lat,Long] not defined at /getWeather');
                return res.json({
                    status: 'error',
                    message: '[Lat,Long] not defined at /getWeather'
                });
            }
        } else {
            logger.error('[Lat,Long] not defined at /getWeather');
            return res.json({
                status: 'error',
                message: '[Lat,Long] not defined at /getWeather'
            });
        }

    }

};

module.exports = new OpenWeatherController();