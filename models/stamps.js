
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
        if(err){
            //first entry
            newStamp.stamp_no = 1 ;
            newStamp.employee_no = employee_no;
            newStamp.stamp_type = 1;
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
    Stamp.find(
        {"employee_no": employee_no},
        function (err, list) {
            console.log(err);
            console.log(list);
        callback(err, list);
    });
};


// ,
//, $lte:new Date(tilldate) mongoose error, actually not working
// "timestamp":{$gte:new Date(fromdate)}
// module.exports = mongoose.model('Stampschema', Stampschema, 'Stampschema');
