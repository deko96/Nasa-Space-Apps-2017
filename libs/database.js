var mysql = require('mysql');

var Database = function(host, username, password, database) {

    this.connect = function() {
        connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: database
        });
        return connection;
    };
};

module.exports = new Database('localhost' ,'nasa', 'nasa2017spaceapps', 'nasa').connect();