var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var employees = require('../../models/mongoose/employees');

exports.strategy =  new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function () {
            exports.authenticateUser(username, password, function (err, user) {
                // if error occured, show it to the user trough the message field
                if(err){
                    return done(null, false, {
                        message: err.message
                    });
                } else {
                    // login worked - let the fun begin
                    return done(null, user);
                }
            })
        });
    }
);

exports.authenticateUser = function(employee_id, password, done) {
    // search user in mongo db
    employees.read(employee_id, function (err, user) {
        // error, return it
        if (err)
            return done(err, false);
        // Username does not exist - return error
        if (!user) {
            //console.log('User "' + employee_id + '" does not exist');
            return done(new Error("Ein Benutzer mit dieser Personalnummer existiert nicht"), false);
        }

        if(!user.active){
            return done(new Error("Der eingegebene Benutzer ist deaktiviert"), false);
        }

        // User exists - check password
        isValidPassword(user, password, function (err, res) {
            if (err) {
                return done(err);
            }

            if (res) {
                // login worked
                return done(null, user);
            } else {
                //wrong password
                //console.log('Invalid password');
                return done(new Error("Passwort ist falsch"), false);
            }
        });
    });
};

var isValidPassword = function(user, password, callback){
    bcrypt.compare(password, user.password, function(err, res) {
        return callback(err, res);
    });
};