var openWeatherAPI = require('../../libs/openweather');
var logger = require('../../libs/logger');
var rp = require("request-promise");

var openWeatherModule = require('openweather-apis');
openWeatherModule.setAPPID(openWeatherAPI.API_KEY);
openWeatherModule.setLang('en');

var OpenWeatherController = function() {
    var baseUviURL = "http://api.openweathermap.org/v3/uvi/";
    var baseLFURL = "http://api.openweathermap.org/data/2.5/forecast";
    var getLaterForecast = function(data, cb) {
        var coords = data.coord;
        // console.log(data.coord);
        var reqObj = {

        };
        rp({
            uri: baseLFURL,
            type: 'GET',
            qs: {
                lat: coords.lat,
                lon: coords.lon,
                cnt: 10,
                appid: openWeatherAPI.API_KEY,
                units: 'metric',
            }
        })

        .then(function(aheadData) {

                var parsedData = JSON.parse(aheadData);
                parsedData.list.splice(0, 1);
                data.laterForecast = parsedData.list;
                cb(data);

            })
            .catch(function(err) {
                console.log(err);
                cb({
                    status: 'error',
                    message: 'Something went wrong with the OpenWeather API !',
                });
            });
    }
    var getUv = function(data, getObj, cb) {

        rp(getObj)

        .then(function(uvData) {
            uvData = JSON.parse(uvData);
            data.uvIndex = uvData.data;
            getLaterForecast(data, cb);
            // cb(data);
        })

        .catch(function(err) {
            logger.error('Something went wrong with the OpenWeather API !');
            return {
                status: 'error',
                message: 'Something went wrong with the OpenWeather API !'
            }
        });
    }
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
                        return getUv(data, getObj, function(data) {
                            res.json(data);
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