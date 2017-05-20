/**
 * Created by blackgear on 20.05.17.
 */


var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../app');
var should = chai.should();
var mitarbeiter = require('../../models/mitarbeiter');

var mongoose = require("mongoose");

var mitarbeiterModel = mitarbeiter.Mitarbeiter;

chai.use(chaiHttp);


var testemp1 = 11000;
var testemp2 = 11001;

describe('employeeModel reads', function () {

    beforeEach(function (done) {
       var newMa = new mitarbeiterModel();
       newMa.mitarbeiternummer = testemp1;
       newMa.vorname = 'TestVorname1';
       newMa.nachname = "TestNachname1";
       newMa.aktiv = true;
       newMa.save(function (err) {
          chai.assert.equal(err, null);
          done();
       });
    });

    afterEach(function (done) {
        mitarbeiterModel.remove({"mitarbeiternummer":testemp1}, function (err) {
            chai.assert.equal(err, null);
            done();
        });

    });

    it('read last ID', function (done) {
        mitarbeiter.readLastID(function (err, id) {
            chai.assert.equal(err, null);
            chai.assert.equal(id, testemp1);
            done();
        });
    });

    it('read one entry', function (done) {
        mitarbeiter.read(testemp1, function (err, doc) {
           chai.assert.equal(err, null);
           chai.assert.equal(doc.mitarbeiternummer, testemp1);
           done();
        });
    });
    it('read one entry, id does not exist', function (done) {
        mitarbeiter.read(12345, function (err, doc) {
            chai.assert.equal(err, null);
            chai.assert.equal(doc, null);
            done();
        });
    });

    it('build db for read list', function (done) {
        //second ma, to get list of two..
        var newMa = new mitarbeiterModel();
        newMa.mitarbeiternummer = testemp2;
        newMa.vorname = 'TestVorname1';
        newMa.nachname = "TestNachname1";
        newMa.aktiv = true;
        newMa.save(function (err) {
            chai.assert.equal(err, null);
            done();
        });

    });

    it('read list', function (done) {
        mitarbeiter.readList("TestVorname1", "TestNachname1", function (err, list) {
            chai.assert.equal(err, null);
            chai.assert.equal(list.length, 2);
            chai.assert.equal(list[0].mitarbeiternummer, testemp2);
            chai.assert.equal(list[1].mitarbeiternummer, testemp1);
            done();
        });
    });

    it('read list, first name', function (done) {
        mitarbeiter.readList("TestVorname1", null, function (err, list) {
            chai.assert.equal(err, null);
            chai.assert.equal(list.length, 2);
            chai.assert.equal(list[0].mitarbeiternummer, testemp2);
            chai.assert.equal(list[1].mitarbeiternummer, testemp1);
            done();
        });
    });
    it('read list lastname', function (done) {
        mitarbeiter.readList(null, "TestNachname1", function (err, list) {
            chai.assert.equal(err, null);
            chai.assert.equal(list.length, 2);
            chai.assert.equal(list[0].mitarbeiternummer, testemp2);
            chai.assert.equal(list[1].mitarbeiternummer, testemp1);
            done();
        });
    });

    it('read list, name not found', function (done) {
        mitarbeiter.readList("badValue", "badValue", function (err, list) {
            chai.assert.equal(err, null);
            chai.assert.equal(list.length, 0);
            done();
        });
    });


    it('clean db after read list', function (done) {
        //clean entry
        mitarbeiterModel.remove({"mitarbeiternummer":testemp2}, function (err) {
            chai.assert.equal(err, null);
            done();
        });
    });




});

describe('employeeModel writes', function () {
    it('create new employee');

    it('create new employee, automated id selection');

    it('update employee data');

    it('set password');
});