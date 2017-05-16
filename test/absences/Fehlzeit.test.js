/**
 * Created by phl on 16.05.17.
 */
// we use chai for asserts
var assert = require("chai").assert;

// function under test
var fut = require("../../models/Fehlzeit");
var check = 0;

describe("Fehlzeit.check", function () {
    //erstellen der falschen Fehlzeit:
    var fehlzeit = new fut;
    fehlzeit.von = new Date(99, 5, 24);
    fehlzeit.bis = new Date(99, 5, 23);
    fehlzeit.kategorie = "abwesend";
    fehlzeit.maNr = 12345689;
    it("Zeitraum muss größer 1 sein", function () {
            fut.check(fehlzeit, function (error) {
                if (error) {
                    check = 1;
                } else {
                    check = 2;
                }
                assert.equal(1, check);
            });
        }
    );
    var fehlzeit2 = new fut;
    fehlzeit2.von = new Date(99, 5, 20);
    fehlzeit2.bis = new Date(99, 5, 23);
    fehlzeit2.kategorie = "abwesend";
    fehlzeit2.maNr = 12345689;
    it("Funktion muss richtige Fehlzeit durchlassen ", function () {
            fut.check(fehlzeit2, function (error) {
                if (error) {
                    check = 1;
                } else {
                    check = 2;
                }
                assert.equal(2, check);
            });
        }
    );
});
// multiple testcases using array
describe('Fehlzeit.check Test der Kategorientests', function () {
    var runs = [
        {it: 'krank', options: {var1: "krank", res: 2}},
        {it: 'abwesend', options: {var1: "abwesend", res: 2}},
        {it: 'homeOffice', options: {var1: "homeOffice", res: 2}},
        {it: 'Urlaub', options: {var1: "urlaub", res: 2}},
        {it: 'ä', options: {var1: "ä", res: 1}},
        {it: '', options: {var1: '', res: 1}},
        {it: '12345', options: {var1: 12345, res: 1}},
        {it: '2.5', options: {var1: 2.5, res: 1}}
    ];

    // setup for all testcases (executed once!)
    before(function () {
    });

    runs.forEach(function (run) {
        it(run.it, function () {
            var fehlzeit5 = new fut;
            fehlzeit5.von = new Date(99, 5, 20);
            fehlzeit5.bis = new Date(99, 5, 23);
            fehlzeit5.kategorie = run.options.var1;
            fehlzeit5.maNr = 12345689;
            fut.check(fehlzeit5, function (error) {
                if (error) {
                    check = 1;
                } else {
                    check = 2;
                }
            });
            assert.equal(run.options.res, check);
        });
    });
})
;


