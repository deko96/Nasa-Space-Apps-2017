var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//Config vars
var port = process.env.PORT || 8080;

//Modules
const Logger = require('./libs/logger');
const Database = require('./libs/database');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Router
const Routers = require('./app/routes')(app);

app.listen(port);