
var mongoose = require('mongoose');


var Schema = mongoose.Schema;



var Stampschema = Schema({
    stamp_no: Number,
    employee_no: Number,
    //1 - in, 2 - out
    stamp_type: Number,
    timestamp: Date
});

mongoose.model('Stamp', Stampschema, 'Stamp');

var Stamp = mongoose.model('Stamp');
exports.Stamp = Stamp;

exports.create = function (employee_no, callback) {
    exports.readLast(employee_no, function (err, doc) {
        var newStamp = new Stamp();
        if(err || !doc){
            //first entry
            newStamp.stamp_no = 1 ;
            newStamp.employee_no = employee_no;
            newStamp.stamp_type = 1;
            // newStamp.timestamp = date.format(new Date(), 'DD.MM.YYYY HH:mm:ss');
            newStamp.timestamp = new Date();
            newStamp.save(function (err) {
                if (err) callback(err);
                else callback();
            });
        } else{

            newStamp.stamp_no = Number(doc.stamp_no) + 1 ;
            newStamp.employee_no = employee_no;

            if (doc.stamp_type == 1){
                newStamp.stamp_type = 2;
            } else newStamp.stamp_type = 1;

            newStamp.timestamp = new Date();
            newStamp.save(function (err) {
                if (err) callback(err);
                else callback();
            });
        }

    });
};
exports.update = function (stamp_no, employee_no, timestamp, callback) {
    exports.read(stamp_no, employee_no, function (err, doc) {
        if (err) callback(err);
        else {
            doc.timestamp = timestamp;
            doc.save(function (err) {
                if (err) callback(err);
                else callback();
            });
        }
    });
};

exports.updateTime = function (stamp_no, employee_no, time, callback) {
    var timeregex = /^[0-9]|1[0-9]|2[0-3]:[0-5][0-9] to 0[0-9]|1[0-9]|2[0-3]:[0-5][0-9]$/;
    if (timeregex.test(time)){
        exports.read(stamp_no, employee_no, function (err, doc) {
            if (err) {
                console.log("error in read.. "+err);
                callback(err);
            }
            else {
                var a = new Stamp(doc);
                console.log("doc: " + doc);
                console.log("time before change: " + doc.timestamp.getHours() + ":" + doc.timestamp.getMinutes());
                doc.timestamp.setHours(time.substring(0, time.indexOf(':')));
                doc.timestamp.setMinutes(time.substring(time.indexOf(':') + 1, time.size));
                console.log("time after change: " + doc.timestamp.getHours() + ":" + doc.timestamp.getMinutes());
                // got no idea, how or why, but it works..
                a.save(function (err) {
                    if (err) {
                        console.log("Error in save..");
                        callback(err);
                    }
                    else callback();
                })
            }
        })
    } else {
        callback("input is not a time.. ")
    }

};

exports.readLast = function (emplyee_no, callback) {
    Stamp.find({employee_no: emplyee_no},{}, {limit:1, sort: {stamp_no: -1}}, function (err, doc) {
        callback(err, doc[0]);
    });
};

exports.read = function (stamp_no, employee_no, callback) {
    Stamp.findOne({stamp_no: stamp_no, employee_no:employee_no}, function (err, doc) {
        callback(err, doc);
    });

};

exports.readList = function (employee_no, callback) {
    Stamp.find({employee_no: employee_no}, function (err, list) {
        callback(err, list);
    });
};

exports.readList = function (employee_no, fromdate, tilldate, callback) {

    var from = exports.parseDate(fromdate);
    if (!from) callback('fromdate');
    var till = exports.parseDate(tilldate);
    if (!till) callback('tilldate');
    if (from > till) {
        var temp = from;
        from = till;
        till = temp;
    }
    till.setHours(23, 59, 59);

    if (from && till){
        Stamp.find(
            {"employee_no": employee_no,
                "timestamp": {$gte:from},
                "timestamp": {$lte:till},

            },
            function (err, list) {
                callback(err, list);
            });
    }
};

exports.parseDate = function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[1] + "/" +  parts[0] + "/" + parts[2]); // months are 0-based
}

