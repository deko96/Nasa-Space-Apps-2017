var openWeatherAPI = require('../../libs/openweather');
var logger = require('../../libs/logger');
var rp = require("request-promise");

var openWeatherModule = require('openweather-apis');
openWeatherModule.setAPPID(openWeatherAPI.API_KEY);
openWeatherModule.setLang('en');

var OpenWeatherController = function() {
    var getUv = function(data, getObj, cb) {
        rp(getObj).then(function(uvData) {
            uvData = JSON.parse(uvData);
            data.uvIndex = uvData.data;
            cb(data);
        }).catch(function(err) {
            logger.error('Something went wrong with the OpenWeather API !');
            return {
                status: 'error',
                message: 'Something went wrong with the OpenWeather API !'
            }
        });
    }
    this.getWeather = function(req, res, next) {
        if (req.query !== 'undefined') {
            var lat = req.query.lat,
                long = req.query.long;
            if ((typeof lat !== 'undefined' && typeof long !== 'undefined') && (lat.trim() !== '' && long.trim() !== '')) {

                lat = parseFloat(lat).toFixed(1);
                long = parseFloat(long).toFixed(1);
                var baseURL = "http://api.openweathermap.org/v3/uvi/";

                var uvIndexURI = baseURL + parseInt(lat) + "," + parseInt(long) + "/current.json?appid=" + openWeatherAPI.API_KEY;
                var getObj = {
                    uri: uvIndexURI,
                    type: "GET",
                    simple: true,
                };

                openWeatherModule.setCoordinate(lat, long);

                openWeatherModule.getAllWeather(function(err, data) {
                    if (!err) {
                        getUv(data, getObj, function(data) {
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