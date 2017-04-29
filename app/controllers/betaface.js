var rp = require('request-promise');
var BetafaceController = function() {

    this.getData = function(req, res, next) {
        var base64Img = req.query.img;

        var getImg = {
            method: "POST",
            uri: 'http://www.betafaceapi.com/service_json.svc/GetImageInfo',
            body: {
                "api_key": "d45fd466-51e2-4701-8da8-04351c872236",
                "api_secret": "171e8465-f548-401d-b63b-caf0dc28df5f",
                "img_uid": "5305417d-2e92-483b-8e25-bdc21cd05e63"
            },
            json: true,
        };
        var uploadImg = {
            method: "POST",
            uri: "http://www.betafaceapi.com/service_json.svc/UploadNewImage_File",
            body: {
                "api_key": "d45fd466-51e2-4701-8da8-04351c872236",
                "api_secret": "171e8465-f548-401d-b63b-caf0dc28df5f",
                "detection_flags": "extended",
                "imagefile_data": base64Img,
                "original_filename": "String content"
            }
        }
        rp(uploadImg).then(function(parsedBody) {
            console.log(parsedBody);
            return res.json(parsedBody);
        }).catch(function(err) {
            console.log(err);
            res.send(err);
        });
    };

};

/**
 * http://www.betafaceapi.com/service_json.svc/UploadNewImage_File
 * http://www.betafaceapi.com/service_json.svc/GetImageInfo
 * {
	"api_key":"String content",
	"api_secret":"String content",
	"detection_flags":"String content",
	"imagefile_data":[81,
	109,
	70,
	122,
	90,
	83,
	65,
	50,
	78,
	67,
	66,
	84,
	100,
	72,
	74,
	108,
	89,
	87,
	48,
	61],
	"original_filename":"String content"
}
 */

module.exports = new BetafaceController();