const sqlite3 = require('sqlite3')
const fs = require('fs')


var db = new sqlite3.Database('routesGPS.sql');

Data = {};

Data.createTable = function() {
    db.run("CREATE TABLE IF NOT EXISTS rutes (fecha TEXT, lat FLOAT, lng FLOAT, terminal TEXT)");
    console.log("Table routes created");
}

Data.updateTable = function(fileName, callback) {
    if (fs.existsSync(fileName)) {
    fs.readFile(fileName, "utf8", function(err, data) {
        if (err) throw err;
        splitData = data.split('\n')
        for (row of splitData) {
            rowSplit = row.split("|")
            insertDataGPS(rowSplit)
        }
        callback("","done updating database")
    });
    } else {
        callback("","file not exist")
    }
}

function insertDataGPS(data) {
    var stmt = db.prepare("INSERT INTO rutes VALUES (?,?,?,?)")
    stmt.run(data[0], data[1], data[2], data[3].replace('\r',''))
    stmt.finalize(function(err) {
        if (err) throw err;
    })
}

Data.getRoute = function(terminal, date, callback) {
    let query = 'SELECT * FROM RUTES WHERE TERMINAL ="'+terminal+'"'+' AND FECHA LIKE "'+date+'%"'
    db.all(query, function (err, rows) {
        if (err) {
            throw err
        } else {
            callback(err,rows)
        }
    })
}

Data.checkAll = function(callback) {
    data = checkSavedData(function(err, res) {
        callback(err,res)
    })
}

function checkSavedData(callback) {
    db.all("SELECT * FROM rutes", function (err, rows) {
        if (err) {
             throw err
        }
        callback(err,rows)
    })
}

module.exports = Data;