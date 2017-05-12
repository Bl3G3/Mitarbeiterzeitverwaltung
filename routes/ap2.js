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

//Fehlzeiten ändern anzeigen
router.get('/feAendern', function (req, res) {
    if (req.query.feId === undefined || req.query.maNr === undefined) {
        if (req.query.maNr === undefined) {
            res.render('temp/maSuche');
        } else if (req.query.feId === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        }
    } else {
        Fehlzeit.getFeById(req.query.feId, function (error, fe) {
            if (error) {
                res.render('error');
            }
            res.render('absences/feAendern', {
                old_vondate: Fehlzeit.getHTMLdate(fe.von),
                old_bisdate: Fehlzeit.getHTMLdate(fe.bis),
                old_kat: fe.kategorie,
                old_maNr: fe.maNr,
                old_feId: fe._id
            });
        });
    }
});

router.get('/feAendernA', function (req, res) {
    if (req.query.maNr === undefined) {
        res.render('temp/maSuchen');
    } else if (req.query.feId === undefined) {
        res.render('absences/fePlain', {maNr: req.query.maNr});
    } else if (req.query.new_vondate === undefined || req.query.new_bisdate === undefined || req.query.new_kat === undefined) {
        res.render('absences/fePlain', {
            maNr: req.query.maNr,
            Meldung: "Es haben eingaben gefehlt bitte versuchen sie es erneut"
        });
    } else {//Alles sollte passen
        var id = require('mongodb').ObjectID(req.query.feId);
        Fehlzeit.findOne({_id: id}, function (error, fe) {
            if (error) {
                res.render('error');
            }
            fe.von = req.query.new_vondate;
            fe.bis = req.query.new_bisdate;
            fe.kategorie = req.query.new_kat;
            fe.save(function (err) {
                if (err) {
                    res.render('absences/feAendernA', {Meldung: "Die Aenderung war nicht", maNr: req.query.maNr});
                }
                res.render('absences/feAendernA', {Meldung: "Die Aenderung war erfolgreich", maNr: req.query.maNr});
            })
        });
    }
});

// Ma Search for Fehlzeiten
router.get('/maSuchen', function (req, res) {

    if (req.query.vorname === undefined || req.query.nachname === undefined) {
        res.render('temp/maSuchen');
        return;
    }
    Mitarbeiter.find({
        nachname: req.query.nachname,
        vorname: req.query.vorname
    }).exec(function (err, maList) {
        res.render('temp/maSuchenList', {
            'maList': maList,
            'suche_vorname': req.query.vorname,
            'suche_nachname': req.query.nachname
        });
    });
});

//Fehlzeitenseite in der man eine Fehlzeit selektieren kann und diese ändern kann.
router.get('/fe', function (req, res) {
    if (req.query.maNr === undefined) {
        res.render('absences/fePlain', {
            Meldung: "Bitte wählen sie vorher einen Mitarbeiter aus",
            maNr: req.query.maNr
        });
    } else {
        if (req.query.such_date === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        } else {//Fehlzeit suchen!
            Fehlzeit.find(
                {
                    maNr: req.query.maNr,
                    von: {$lte: req.query.such_date},
                    bis: {$gte: req.query.such_date}
                }).exec(function (err, feList) {
                if (err) {
                    res.render('error');
                }
                res.render('absences/fe', {
                    'feList': feList, maNr: req.query.maNr, gesuchtDate: req.query.such_date
                })
                ;
            });
        }

    }
});

//Fehlzeit hinzufügen
router.get('/feHinzufuegen', function (req, res) {
    if (req.query.vondate === undefined || req.query.bisdate === undefined || req.query.kat === undefined || req.query.maNr === undefined) {
        res.render('absences/feHinzufuegen')
    }
    //Fehlzeit aus den Parametern erstellen.
    var fe_von = req.query.vondate;
    var fe_bis = req.query.bisdate;
    var fe_kat = req.query.kat;
    var fe_ma = req.query.maNr;
    var kat = req.query.kat;
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
            antwort = "Die Speicherung der Fehlzeit vom" + req.query.vondate + "-" + req.query.bisdate + "wurde nicht erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort, maNr: req.query.maNr});
        } else {
            antwort = "Die Speicherung der Fehlzeit vom" + req.query.vondate + "-" + req.query.bisdate + "wurde erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort, maNr: req.query.maNr});
        }
    })
});
module.exports = router;