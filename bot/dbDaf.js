
var config = require('config');
var mysql = require('mysql');

function createDbConnection() {
    var con = mysql.createConnection({
        host: config.get("host"),
        user: config.get("user"),
        password: config.get("password"),
        database: config.get("database"),
        port: config.get("port")
    });

    con.connect(function (err) {
        if (err) throw err;
    });
    return con;
}

module.exports = {
    createDbConnection: createDbConnection
}