// const expect = require('chai').expect;
// const sinon = require('sinon');
// const strategy = require('./strategy');
// const employees = require('../../models/mongoose/employees');
//
// describe('The strategy module', function () {
//     describe('#authenticateUser()', function () {
//         const sinon = require('sinon');
//         const chai = require('chai');
//         const sinonChai = require('sinon-chai');
//
//         var employee = new employees.Employee();
//
//         before(function (setupDone) {
//             sinon.sandbox.create();
//             chai.use(sinonChai);
//
//             employee.employee_no = 12;
//             employee.active = true;
//             employee.set_password("87.&/774zzUU", function () {
//                 var dummy_read = sinon.sandbox.stub(employees, 'read');
//
//                 dummy_read.withArgs(12).callsArgWith(1, null, employee);
//                 dummy_read.callsArgWith(1, null, null);
//
//                 setupDone();
//             });
//         });
//
//         after(function(){
//             sinon.sandbox.restore()
//         });
//
//         beforeEach(function () {
//             //sandbox = sinon.sandbox.create()
//         });
//
//         afterEach(function () {
//             //sandbox.restore()
//         });
//
//
//         it('should return success when given a correct employee_id/password combination', function (testDone) {
//             strategy.authenticateUser(12, "87.&/774zzUU", function (err, user) {
//                 expect(err).to.equal(null);
//                 expect(user).to.equal(employee);
//                 testDone()
//             });
//         });
//
//         it('should return the correct error when a wrong password is given', function (testDone) {
//             strategy.authenticateUser(12, "87.&/774zzUUwrong", function (err, user) {
//                 expect(err.message).to.equal("Passwort ist falsch");
//                 expect(user).to.equal(false);
//                 testDone()
//             });
//         });
//
//         it('should return the correct error when a non existent employee_id is given', function (testDone) {
//             strategy.authenticateUser(13, "87.&/774zzUU", function (err, user) {
//                 expect(err.message).to.equal("Ein Benutzer mit dieser Personalnummer existiert nicht");
//                 expect(user).to.equal(false);
//                 testDone()
//             });
//         });
//
//         it('should return the correct error when a inactive employee_id is given', function (testDone) {
//             employee.active = false;
//             strategy.authenticateUser(12, "87.&/774zzUU", function (err, user) {
//                 employee.active = true;
//                 expect(err.message).to.equal("Der eingegebene Benutzer ist deaktiviert");
//                 expect(user).to.equal(false);
//                 testDone()
//             });
//
//         });
//     });
// });