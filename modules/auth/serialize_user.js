var employees = require('../../models/mongoose/employees');

module.exports.serialize = function(user, done) {
    done(null, user._id);
};

module.exports.deserialize = function(id, done) {
    employees.Employee.findById(id, function(err, user) {
        done(err, user);
    });
};
