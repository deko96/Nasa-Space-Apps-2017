var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' })
});


var port = process.env.PORT || 8080;

app.listen(port);