var openWeatherAPI = require('../../libs/openweather');
var logger = require('../../libs/logger');

var openWeatherModule = require('openweather-node');
openWeatherModule.setAPPID(openWeatherAPI.API_KEY);

var OpenWeatherController = function() {

    this.getWeather = function(req, res, next) {
        var lat = req.query.lat,
            long = req.query.long;
        if (req.query !== 'undefined') {
            if ((typeof lat !== 'undefined' && typeof long !== 'undefined') && (lat.trim() !== '' && long.trim() !== '')) {
                var params = {
                    lat: lat,
                    long: long,
                };
                openWeatherModule.now('Skopje', function(err, data) {
                    if (!err) {
                        return res.json(data);
                    }
                    logger.error('Something went wrong with the OpenWeather API !');
                    return res.json({
                        status: 'error',
                        message: 'Something went wrong with the OpenWeather API !'
                    });
                })
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