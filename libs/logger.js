var cheerio = require('cheerio');

var Logger = function() {

    this.success = function(message) {
        return console.log('%s %s', cheerio.green('[OK]'), message);
    };

    this.warning = function(message) {
        return console.log('%s %s', cheerio.orange('[WARN]'), message);
    }

    this.error = function(message) {
        return console.log('%s %s', cheerio.red('[ERROR]'), message);
    }
};

module.exports = new Logger();