// Libraries
var googleAPI = require('../libs/googleapi');

// Controllers
var citiesController = require('./controllers/cities');
var beachesController = require('./controllers/beaches');
var facePlusController = require('./controllers/faceplus');
var openWeatherController = require("./controllers/openweather");

module.exports = function(app) {

    /**
     * Get Cities Router
     */
    app.get('/getCities', citiesController.getCities);

    /**
     * Get Beaches Router
     */
    app.get('/getBeaches', beachesController.getBeaches);

    /**
     * Betaface Controller
     */
    app.get('/sendImage', facePlusController.getData);

    /**
     * Test Controller
     */
    app.post('/testRoute', function(req, res, next) {
        res.json(req.body);
    });

    /**
     * Open Weather Controller
     */

    app.get('/getWeather', openWeatherController.getWeather());

    /**
     * 404 Route
     */
    app.use(function(req, res) {
        res.status(404).json({
            status: 404,
            message: 'Endpoint "' + req.originalUrl + '" not found.'
        });
    });
}