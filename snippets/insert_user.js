var db_config = require("../db_config");
var mongoose = require("mongoose");
var employees = require("../models/employees");
var strategy_mongoose = require("../modules/auth/strategy");


var myArgs = process.argv.slice(2);
if(myArgs.length < 1){
    printUsage();
    return;
}
var command = myArgs[0];

// Connection URL

mongoose.Promise = global.Promise;
mongoose.connect(db_config.url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    if(command === "add"){
        if(myArgs.length !== 3){
            printUsage();
            return;
        }
        var user_id = myArgs[1];
        var password = myArgs[2];
        add(user_id, password)

    } else if(command === "test") {
        if(myArgs.length !== 3){
            printUsage();
            return;
        }
        var user_id = myArgs[1];
        var password = myArgs[2];
        test_login(user_id, password);

    } else if(command === "list") {
        list();
    }


    // we're connected!
});

function printUsage(){
    console.error("Usage: nodejs user_admin.js add <user_id> <password> \n \
nodejs user_admin.js remove <user_id> \n \
nodejs user_admin.js list\n \
\nodejs user_admin.js test <user_id> <password>\n \
");
}

function add(user_id, password){
    var e = new employees.Employee();
    e.employee_no = user_id;
    e.first_name = "unnamed";
    e.last_name = "unnamed";
    e.hr = false;
    e.active = true;
    e.set_password(password, function () {
        e.save(function(err) {
            if (err){
                console.log(err);
                process.exit(1)
            } else {
                console.log("DONE");
                process.exit(0);
            }
        });
    });
}

function list() {
    employees.Employee.find(function (err, kittens) {
        if (err) return console.error(err);
        console.log(kittens);
    })
}

function test_login(user_id, password){
    strategy_mongoose.authenticateUser(user_id, password,function (err, user) {
        if (err) return console.error(err);
        console.log(user+" login successful");
    })
}
