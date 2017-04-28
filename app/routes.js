// Libraries
var googleAPI = require('../libs/googleapi');

// Controllers
var beachesController = require('./controllers/beaches');
var betafaceController = require('./controllers/betaface');

module.exports = function(app) {

    /**
     * Get Beaches Router
     */
    app.get('/getBeaches', beachesController.getBeaches);

    /**
     * Betaface Controller
     */
    app.post('/sendImage', betafaceController.getData);

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