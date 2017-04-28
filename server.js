var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Config vars
var port = process.env.PORT || 8080;
var googleAPI = require('./libs/googleapi');

//Modules
const logger = require('./libs/logger');
const database = require('./libs/database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});

database.query('SELECT COUNT(*) as kur FROM `cities`', function(error, data, fields) {
    if (error) {
        return logger.error(error);
    }
    console.log(data);
});

app.listen(port);