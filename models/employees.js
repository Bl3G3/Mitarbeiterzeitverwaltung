var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;


var EmployeeSchema = Schema({
    employee_no: {type: Number, required: true, unique: true},
    first_name: {type:String, required: true},
    last_name: {type:String, required: true},
    active: {type:Boolean, required: true},
    street: String,
    city: String,
    phone: Number,
    mail: String,
    department: String,
    rights: Boolean,

    username: String,
    password: String
});

EmployeeSchema.methods.set_password = function(password, callback) {
    this.password = bcrypt.hashSync(password);
    return callback();
    /*bcrypt.hash(password, null, null, function(err, hash) {
     Employee.password = hash;
     callback();
     });*/
};
mongoose.model('Employee', EmployeeSchema, 'Employee');

var Employee = mongoose.model('Employee');
exports.Employee = Employee;

exports.create = function(employee_no, first_name, last_name, active, street, city, phone, mail, department, rights, username, callback) {
    //to do prüfen das es kenen gibt
    var newEmployee = new Employee();
    newEmployee.employee_no = employee_no;
    newEmployee.first_name = first_name;
    newEmployee.last_name = last_name;
    newEmployee.active = active;
    newEmployee.street = street;
    newEmployee.city = city;
    newEmployee.phone = phone;
    newEmployee.mail = mail;
    newEmployee.department = department;
    newEmployee.rights = rights;
    newEmployee.username = username;
    newEmployee.save(function(err) {
        if (err)
        {
            callback(err);
        }
        else
        {callback();}
    });
};
exports.update = function(employee_no, first_name, last_name, active, street, city, phone, mail, department, rights, username, callback) {

    exports.read(id, function(err, doc) {
        if (err) callback(err);
        else {
            //manr kann nicht geändert werden
            //doc.employee_no = employee_no;
            doc.first_name = first_name;
            doc.last_name = last_name;
            doc.active = active;
            doc.street = street;
            doc.city = city;
            doc.phone = phone;
            doc.mail = mail;
            doc.department = department;
            doc.rights = rights;
            doc.username = username;

            doc.save(function(err) {
                if (err) callback(err);
                else
                    callback();
            });
        }
    });
};

exports.set_password = function(id, password, callback) {
    exports.read(id, function(err, doc) {
        if (err) {
            console.log("this is a test error");
            callback(err);
        }
        else {
            doc.password = password;
            doc.save(function(err) {
                if (err) callback(err);
                else
                    callback();
            });
        }
    });
};

exports.read = function(id, callback) {
    Employee.findOne({ employee_no: id }, function(err, doc) {
        //if (err) callback(err);
        //else
        callback(err,doc);
    });
};


// exports.readTest = function (id, callback) {
//     Employee.find(function(err, mas) {
//         if (err)
//             console.log(err);
//
//         console.log(mas.length);
//
//     });
// };


exports.existsduplicate = function (vorname,nachname, callback)
{
    //irgendwie nach namen suchen
    Employee.findOne({first_name: vorname, last_name: nachname},function (err,doc) {

        if(doc)
        {
            console.log("No duplicate.");
            //console.log(users[0]);
            callback(false);

        }
        else
        {
            console.log("duplicate exists.");
            callback(true);
        }

    });

};


exports.list1 = function(callback) {
    Employee.find({}, function(err, users) {
        var userMap = [];
        var i =0;
        users.forEach(function(user) {
            userMap[i++] = user;
        });
        callback(userMap);
    })
};


// module.exports = mongoose.model('Empl', Mitarbeiterschema, 'Mitarbeiter');


