var BetafaceController = function() {

    this.getData = function(req, res, next) {

        return res.send('ok');
    };

};

module.exports = new BetafaceController();