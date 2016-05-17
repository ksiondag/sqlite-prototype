'use strict';

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database(':memory:');

var where = function (params) {
    var key;
    var ret = [];
    for (key in params) {
        if (!params.hasOwnProperty(key)) {
            continue;
        }
        ret.push('' + key + ' = "' + params[key] + '"');
    }

    return ret.join(' AND ');
};

var typeConversion = {};
typeConversion[String] = 'TEXT';
typeConversion[Number] = 'NUMERIC';
var typeName = function (type) {
    return typeConversion[type];
};

var def = function (columns) {
    var key;
    var ret = [];
    for (key in columns) {
        if (!columns.hasOwnProperty(key)) {
            continue;
        }
        ret.push('' + key + ' ' + typeName(columns[key]));
    }

    return '(' + ret.join(', ') + ')';
};

var GeneralModel = function (name, columns) {
var key;

this.prototype = {

    findById: function (id, callback) {
        db.get('SELECT *, rowid as _id FROM ' + name + ' WHERE rowid = ?', [id], callback);
    },

    findOne: function (params, callback) {
        db.get('SELECT *, rowid as _id FROM ' + name + ' WHERE ' + where(params), [], callback);
    },

    insert: function (params, callback) {
        var key, cols, vals;

        if (!callback) {
            callback = () => null;
        }

        cols = [];
        vals = [];
        for (key in params) {
            if (!params.hasOwnProperty(key)) { continue; }
            if (!columns.hasOwnProperty(key)) {
                throw 'Unexpected column ' + key + ' for table ' + name;
            }

            // The column should define the type of the param
            // If the parameter given can't be cast to that type,
            // this should throw an error
            cols.push(key);
            params[key] = columns[key](params[key]);
            vals.push("'" + params[key] + "'");
        }

        db.run('INSERT INTO ' + name + ' (' + cols.join(', ') + ') VALUES (' + vals.join(', ') + ')', [], function (err) {
            if (err) { throw err; }
            params._id = this.lastID;
            callback(params);
        });
    }

};

for (key in columns) {
    if (!columns.hasOwnProperty(key)) {
        continue;
    }
    this[key] = columns[key];
}

db.serialize(function () {
    db.run(
        'CREATE TABLE IF NOT EXISTS ' + name + ' ' + def(columns),
        [],
        function (err) {
            if (err) { throw err; } 
        }
    );
});

};

module.exports = GeneralModel;

if (require.main === module) {
(function () {

var TestModel = new GeneralModel('Test', {
    name: String,
    text: String
});

TestModel.prototype.insert({
    name: 'Blah',
    text: 'Awesome'
}, function (test) {
    console.log(test);
    TestModel.prototype.findById(test._id, function (err, row) {
        if (err) { throw err; }
        console.log(row);
    });
    TestModel.prototype.findOne({name: 'Blah'}, function (err, row) {
        if (err) { throw err; }
        console.log(row);
    });
});

})();
}

