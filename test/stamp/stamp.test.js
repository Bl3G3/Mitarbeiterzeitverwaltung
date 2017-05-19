/**
 * Created by blackgear on 18.05.17.
 */

process.env.NODE_ENV = 'test';


var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var stamps = require('../../models/stamps');

var mongoose = require("mongoose");

var stampModel = stamps.Stamp;

chai.use(chaiHttp);


describe("stamps", function () {
    // beforeEach(function(done){
    //     var newStamp = new stampModel({
    //         employee_no: 9999,
    //         stamp_no: 1,
    //         stamp_type : 1,
    //         timestamp: new Date()
    //     });
    //     newStamp.save(function(err) {
    //         console.log(err);
    //         done();
    //     });
    // });

    it('should show last written stamp on /home GET', function (done) {
        chai.request(server).get('/home').end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });

});

describe("stampsmodel read", function () {


    it('function readOne', function (done) {
        stamps.read(1, 9999, function (err, doc) {
            chai.assert.equal(null, err);
            chai.assert.equal(9999, doc.employee_no);
            chai.assert.equal(1, doc.stamp_no);
            chai.assert.equal(1, doc.stamp_type);
            done();
        })
    });

    it('function readOne - not found', function (done) {
        stamps.read(1, 9996, function (err, doc) {
            //just return empty values
            chai.assert.equal(null, err);
            chai.assert.equal(null, doc);
            done();
        })
    });


    it('function readlist one entry', function (done) {
        var today = new Date();
        var todayString = today.getDate() + "." + (today.getMonth() +1)+ "." + today.getFullYear();

        stamps.readList(9999, "01.01.2017", todayString, function (err, list) {
            chai.assert.equal(null, err);
            chai.assert.equal(1, list.length);
            chai.assert.equal(9999, list[0].employee_no);
            chai.assert.equal(1, list[0].stamp_no);
            done();
        });

    });

    it('function readlist bordered left', function (done) {

        stamps.readList(9997, "02.05.2010", "03.05.2010", function (err, list) {
            chai.assert.equal(null, err);
            chai.assert.equal(2, list.length);
            chai.assert.equal(9997, list[0].employee_no);
            chai.assert.equal(3, list[0].stamp_no);
            chai.assert.equal(1, list[0].stamp_type);
            chai.assert.equal(4, list[1].stamp_no);
            chai.assert.equal(2, list[1].stamp_type);
            done();
        });
    });

    it('function readlist bordered right', function (done) {
        stamps.readList(9997, "02.01.2010", "02.01.2010", function (err, list) {
            chai.assert.equal(null, err);
            chai.assert.equal(2, list.length);
            chai.assert.equal(9997, list[0].employee_no);
            chai.assert.equal(1, list[0].stamp_no);
            chai.assert.equal(1, list[0].stamp_type);
            chai.assert.equal(2, list[1].stamp_no);
            chai.assert.equal(2, list[1].stamp_type);
            done();
        });
    });

    it('function readlist - ma not not found', function (done) {
        stamps.readList(9996, "01.01.2010", "01.01.2015", function (err, list) {
            //just return an empty list
            chai.assert.equal(null, err);
            chai.assert.equal(0, list.length);
            done();
        });
    });

    it('function readlist - fromdate bad value', function (done) {
        stamps.readList(9997, "0a1.01.2010", "01.01.2015", function (err, list) {
            //just return an empty list
            chai.assert.equal("Invalid Date", err.value);
            done();
        });
    });

    it('function readlist - tilldate bad value', function (done) {
        stamps.readList(9997, "01.01.2010", "0a1.01.2015", function (err, list) {
            //just return an empty list
            chai.assert.equal("Invalid Date", err.value);
            done();
        });
    });

    it('function readLast, has stamps', function (done) {
        stamps.readLast(9997, function (err, doc) {
            chai.assert.equal(err, null);
            chai.assert.equal(doc.stamp_no, 4);
            done();
        });
    });

    it('function readLast, not stamos available', function (done) {
        stamps.readLast(9996, function (err, doc) {
            chai.assert.equal(err, null);
            chai.assert.equal(doc, null);
            done();
        });
    });

    // afterEach(function(done){
    //     // cleanDB(done);
    //     done();
    // });
});

describe("stampsmodel parse date", function () {

    it('function parse date to default mongo format', function (done) {
        var parsed = stamps.parseDate("01.02.2017");
        chai.assert.equal(01, parsed.getDate());
        // month array starts with zero..
        chai.assert.equal(01, parsed.getMonth());
        chai.assert.equal(2017, parsed.getFullYear());
        done();
    });

describe("stampsmodel writes", function () {
    it('function create new stamp', function (done) {
        stamps.create(10000, function (err) {
            chai.assert.equal(null, err);

            stamps.readLast(10000, function (err, doc) {
                chai.assert.equal(null, err);
                //näherungswert.
                chai.assert.equal(new Date().getHours(), doc.timestamp.getHours());
                done();
            });
        });
    });
    it("stampsmodel update time correct input", function (done) {
        stamps.read(1, 9999, function (err, doc) {
            var newTime;
            if (doc.timestamp.getMinutes() == 22){
                newTime = doc.timestamp.getHours() + ":" + (doc.timestamp.getMinutes()+1);
            } else newTime = doc.timestamp.getHours() + ":22";

            stamps.updateTime(doc.stamp_no, doc.employee_no, newTime, function (err) {
                chai.assert.equal(err, null);
                stamps.read(1, 9999, function (err, doc){
                    chai.assert.equal(err, null);
                    doc.timestamp.getMinutes().should.satisfy(function (num) {
                        if ((num == 22) || (num === 23)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    done();
                });
            });
        });
    });
    it("stampsmodel update time bad input", function (done) {
        stamps.read(1, 9999, function (err, doc) {
            var newTime = doc.timestamp.getHours() + ":asd";
            stamps.updateTime(doc.stamp_no, doc.employee_no, newTime, function (err) {
                chai.assert.equal(err, "InputError");
                done();
            });
        });
    });
});


});




function dbSetup(done) {
    var newStamp = new stampModel({
        employee_no: 9999,
        stamp_no: 1,
        stamp_type : 1,
        timestamp: new Date()
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9998,
        stamp_no: 1,
        stamp_type : 1,
        timestamp: new Date()
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9998,
        stamp_no: 2,
        stamp_type : 2,
        timestamp: new Date()
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9997,
        stamp_no: 1,
        stamp_type : 1,
        timestamp: new Date("01.02.2010 14:45")
        //    dateformat: saved as 02.01.2010
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9997,
        stamp_no: 2,
        stamp_type : 2,
        timestamp: new Date("01.02.2010 21:30")
    //    dateformat: saved as 02.01.2010
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9997,
        stamp_no: 3,
        stamp_type : 1,
        timestamp: new Date("05.02.2010 22:10")
        //    dateformat: saved as 02.05.2010
    });
    newStamp.save(function(err) {
        console.log(err);

    });
    newStamp = new stampModel({
        employee_no: 9997,
        stamp_no: 4,
        stamp_type : 2,
        timestamp: new Date("05.03.2010 06:00")
        //    dateformat: saved as 03.05.2010
    });
    newStamp.save(function(err) {
        console.log(err);
        done();
    });
}
function cleanDB(done) {
    stampModel.remove({"employee_no":9999,
                        "employee_no":9998,
                        "employee_no":9997}, function (err) {
        done();
    });
}