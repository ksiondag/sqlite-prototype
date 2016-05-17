'use strict';

var bcrypt = require('bcrypt-nodejs');

var GeneralModel = require('../database/wrapper');

var UserModel = new GeneralModel('User', {
    email: String,
    password: String
});

UserModel.prototype.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserModel.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserModel.prototype.insert({
    email: 'ksiondag846@gmail.com',
    password: UserModel.prototype.generateHash('testpassword')
});

module.exports = UserModel;

if (require.main === module) {
    UserModel.prototype.findOne({email: 'ksiondag846@gmail.com'}, function (err, row) {
        if (err) { throw err; }
        console.log(row);
    });
}

