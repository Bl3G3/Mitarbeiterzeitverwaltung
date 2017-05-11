var express = require('express');
var Fehlzeit = require('../models/Fehlzeit');
//var Mitarbeiter = require('../models/employees');
var Mitarbeiter = require('../models/mitarbeiter');

var router = express.Router();

// middleware that is specific to this router

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

// Only for testing
//router.get('/', function (req, res) {
//    res.render('absences/main')
//});

//Fehlzeiten ändern anzeigen
router.get('/feAendern', function (req, res) {
    if (req.param('feId') === undefined || req.param('maNr') === undefined) {
        if (req.param('maNr') === undefined) {
            res.render('temp/maSuche');
        } else if (req.param('feId') === undefined) {
            res.render('absences/fePlain', {maNr: req.param('maNr')});
        }
    } else {
        var id = require('mongodb').ObjectID(req.param('feId'));
        Fehlzeit.findOne({_id: id}, function (error, fe) {
            if (error) {
                res.render('error');
            }
            var von = new Date(fe.von);
            von = von.toISOString().slice(0, 10);
            var bis = new Date(fe.bis);
            bis = bis.toISOString().slice(0, 10);
            res.render('absences/feAendern', {
                old_vondate: von,
                old_bisdate: bis,
                old_kat: fe.kategorie,
                old_maNr: fe.maNr,
                old_feId: fe._id
            });
        });
    }
});
router.get('/feAendernA', function (req, res) {
    if (req.param('maNr') === undefined) {
        res.render('temp/maSuchen');
    } else if (req.param('feId') === undefined) {
        res.render('absences/fePlain', {maNr: req.param('maNr')});
    } else if (req.param('new_vondate') === undefined || req.param('new_bisdate') === undefined || req.param('new_kat') === undefined) {
        res.render('absences/fePlain', {
            maNr: req.param('maNr'),
            Meldung: "Es haben eingaben gefehlt bitte versuchen sie es erneut"
        });
    } else {//Alles sollte passen
        var id = require('mongodb').ObjectID(req.param('feId'));
        Fehlzeit.findOne({_id: id}, function (error, fe) {
            if (error) {
                res.render('error');
            }
            fe.von = req.param('new_vondate');
            fe.bis = req.param('new_bisdate');
            fe.kategorie = req.param('new_kat');
            fe.save(function (err) {
                if (err) {
                    res.render('absences/feAendernA', {Meldung: "Die Aenderung war nicht", maNr: req.param('maNr')});
                }
                res.render('absences/feAendernA', {Meldung: "Die Aenderung war erfolgreich", maNr: req.param('maNr')});
            })
        });
    }
});

// Ma Search for Fehlzeiten
router.get('/maSuchen', function (req, res) {

    if (req.param('vorname') === undefined || req.param('nachname') === undefined) {
        res.render('temp/maSuchen');
        return;
    }
    Mitarbeiter.find({
        nachname: req.param('nachname'),
        vorname: req.param('vorname')
    }).exec(function (err, maList) {
        res.render('temp/maSuchenList', {
            'maList': maList,
            'suche_vorname': req.param('vorname'),
            'suche_nachname': req.param('nachname')
        });
    });
});

//Fehlzeitenseite in der man eine Fehlzeit selektieren kann und diese ändern kann.
router.get('/fe', function (req, res) {
    if (req.param('maNr') === undefined) {
        res.render('absences/fePlain', {
            Meldung: "Bitte wählen sie vorher einen Mitarbeiter aus",
            maNr: req.param('maNr')
        });
    } else {
        if (req.param('such_date') === undefined) {
            res.render('absences/fePlain', {maNr: req.param('maNr')});
        } else {//Fehlzeit suchen!
            Fehlzeit.find(
                {
                    maNr: req.param('maNr'),
                    von: {$lte: req.param('such_date')},
                    bis: {$gte: req.param('such_date')}
                }).exec(function (err, feList) {
                if (err) {
                    res.render('error');
                }
                res.render('absences/fe', {
                    'feList': feList, maNr: req.param('maNr'), gesuchtDate: req.param('such_date')
                })
                ;
            });
        }

    }
});

//Fehlzeit hinzufügen
router.get('/feHinzufuegen', function (req, res) {
    if (req.param('vondate') === undefined || req.param('bisdate') === undefined || req.param('kat') === undefined || req.param('maNr') === undefined) {
        res.render('absences/feHinzufuegen')
    }
    //Fehlzeit aus den Parametern erstellen.
    var fe_von = req.param('vondate');
    var fe_bis = req.param('bisdate');
    var fe_kat = req.param('kat');
    var fe_ma = req.param('maNr');
    var kat = req.param('kat');
    //TODO Prüfung der Fehlzeit auf Korrektheit

    //Prüfung der Eingabe
    if (fe_von > fe_bis) {
        res.render('absences/feHinzufuegen', {Meldung: "Der Start muss vor dem Ende sein"});
        return;
    }
    if (!(fe_kat === "krank" || fe_kat === "urlaub" || fe_kat === "homeOffice" || fe_kat === "abwesend")) {
        var meldung = "Die Kategorie darf nur ( krank, urlaub, homeOffice oder abwesend enthalten";
        res.render('absences/feHinzufuegen', {Meldung: meldung});
    }
    //TODO Ist zu dem Ztpkt. schon eine Fehlzeit gespeichert?
    Fehlzeit.find({maNr: fe_ma, $or: [{von: {$lte: fe_von, $gte: fe_bis}}, {bis: {$gte: fe_von, $lte: fe_bis}}]}
        , function (err, fehlzeitfind) {
            if (err) {
                var meldung = "Es existiert schon eine Fehlzeit im Zeitraum: " + fe_von + "-" + fe_bis;
                res.render('absences/feHinzufuegen', {Meldung: meldung});
            }
        });

    //Speicherung start
    var fehlzeit = new Fehlzeit();
    fehlzeit.von = fe_von;
    fehlzeit.bis = fe_bis;
    fehlzeit.kategorie = fe_kat;
    fehlzeit.maNr = fe_ma;

    fehlzeit.save(function (err) {
        var antwort;
        if (err) {
            antwort = "Die Speicherung der Fehlzeit vom" + req.param('vondate') + "-" + req.param('bisdate') + "wurde nicht erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort, maNr: req.param('maNr')});
        } else {
            antwort = "Die Speicherung der Fehlzeit vom" + req.param('vondate') + "-" + req.param('bisdate') + "wurde erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort, maNr: req.param('maNr')});
        }
    })
});
module.exports = router;