var chalk = require('chalk');

var Logger = function() {

    this.success = function(message) {
        return console.log('%s %s', chalk.green('[OK]'), message);
    };

    this.warning = function(message) {
        return console.log('%s %s', chalk.orange('[WARN]'), message);
    }

    this.error = function(message) {
        return console.log('%s %s', chalk.red('[ERROR]'), message);
    }
};

module.exports = new Logger();