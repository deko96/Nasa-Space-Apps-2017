var Logger = require('../../libs/logger');
var Request = require('request-promise');

var FacePlus = function() {
    var API_URL = 'https://api-us.faceplusplus.com/facepp/v3/detect';
    var API_KEY = 'pjuinTgUcurf0kOACcCZDRBEGmrqJ8al';
    var API_SECRET = 'fW8qlqPYqKMXEQXF7i0EsRz1bTgHVLTr';


    this.getData = function(req, res, next) {

        if (typeof req.body.image === 'undefined' || req.body.image === null) {
            return next();
        }

        return Request({
            method: 'POST',
            uri: API_URL,
            form: {
                api_key: API_KEY,
                api_secret: API_SECRET,
                image_base64: req.body.image,
                return_attributes: 'ethnicity'
            },
            json: true
        }).then(function(data) {
            console.log(data.faces);
            console.log(data.faces.length);
            if (data.faces.length == 1) {
                return res.json({
                    ethnicity: data.faces[0].attributes.ethnicity.value
                });
            } else {
                return res.status(400).json({
                    status: 400,
                    message: 'Please take a picture of your face!'
                });
            }
        }).catch(function(error) {
            return console.log(error);
        });

    };

};

module.exports = new FacePlus();