var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Config vars
var port = process.env.PORT || 8080;

//Modules
const logger = require('./libs/logger.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});


app.listen(port);