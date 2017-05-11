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

//Fehlzeiten ändern
router.get('/feAendern', function (req, res) {
    res.render('absences/feAendern');
    if (!(req.param('new_vondate') === undefined || req.param('new_bisdate') === undefined || req.param('new_kat') === undefined || req.param('new_maNr') === undefined)) {
        //Es wurde noch keine Änderungen eingetragen --> seite normal rendern
        if (!(req.param('vondate') === undefined || req.param('bisdate') === undefined || req.param('kat') === undefined || req.param('maNr') === undefined))
        {
            //Parameter vorhanden zum rendern der Seite
            res.render('absences/feAendern', {
                old_vondate: req.param('vondate'),
                old_bisdate: req.param('bisdate'),
                old_kat: req.param('kat'),
                old_maNr: req.param('maNr')
            });
        } else {
            res.render('error');
        }
    }else{
        res.render('error');
    }
});

// Ma Search for Fehlzeiten
router.get('/maSuchen', function (req, res) {

    if (req.param('vorname') === undefined || req.param('nachname') === undefined) {
        res.render('temp/maSuchen');
        return;
    }
    Mitarbeiter.find({
        name: req.param('nachname'),
        vorname: req.param('vorname')
    }).exec(function (err, maList) {
        res.render('temp/maSuchenList', {'maList': maList});
    });
});

//Fehlzeitenseite in der man eine Fehlzeit selektieren kann und diese ändern kann.
router.get('/fe', function (req, res) {
    res.render('absences/fe');
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
    console.log(fe_von + fe_bis + fe_kat + fe_ma);
    fehlzeit.save(function (err) {
        var antwort;
        if (err) {
            antwort = "Die Speicherung der Fehlzeit vom" + req.param('vondate') + "-" + req.param('bisdate') + "wurde nicht erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort});
        } else {
            antwort = "Die Speicherung der Fehlzeit vom" + req.param('vondate') + "-" + req.param('bisdate') + "wurde erfolgreich gespeichert";
            res.render('absences/feHinzugfuegenA', {Meldung: antwort});
        }
    })
});
module.exports = router;