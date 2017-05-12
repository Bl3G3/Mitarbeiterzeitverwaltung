var express = require('express');
var Fehlzeit = require('../models/Fehlzeit');
var Mitarbeiter = require('../models/mitarbeiter');
var model = require('../modules/absences/ap2model.js');

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
            res.render('temp/maSuchen');
        } else if (req.query.feId === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        }
    } else {
        Fehlzeit.getFeById(req.query.feId, function (error, fe, meldung) {
            if (error) {
                res.render('error', {message: meldung});
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
    } else {
        Fehlzeit.saveById(req.query.feId, req.query.new_vondate, req.query.new_bisdate, req.query.new_kat, function (error, fehlzeit, meldung) {
            if (error) {
                res.render('absences/feAendernA', {
                    Meldung: meldung,
                    maNr: fehlzeit.maNr
                });
            } else {
                res.render('absences/feAendernA', {Meldung: meldung, maNr: fehlzeit.maNr});
            }
        });
    }
});

router.get('/maSuchen', function (req, res) {
    if (req.query.vorname === undefined || req.query.nachname === undefined) {
        res.render('temp/maSuchen');
        return;
    }
    model.getMitarbeiterbyFullName(req.query.vorname,req.query.nachname,function (error,maList,meldung) {
        if(error)
        {
            res.render('temp/maSuchen',{Meldung:meldung,searchFirstName:req.query.vorname,searchLastName:req.query.nachname});
        }else{
            res.render('temp/maSuchenList', {
                'maList': maList,
                'suche_vorname': req.query.vorname,
                'suche_nachname': req.query.nachname
            });
        }
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
        res.render('absences/feHinzufuegen',{maNummer: req.query.maNr});
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
        res.render('absences/feHinzufuegen', {Meldung: "Der Start muss vor dem Ende sein", maNummer: req.query.maNr});
        return;
    }
    if (!(fe_kat === "krank" || fe_kat === "urlaub" || fe_kat === "homeOffice" || fe_kat === "abwesend")) {
        var meldung = "Die Kategorie darf nur ( krank, urlaub, homeOffice oder abwesend enthalten";
        res.render('absences/feHinzufuegen', {Meldung: meldung, maNummer: req.query.maNr});
    }
    //TODO Ist zu dem Ztpkt. schon eine Fehlzeit gespeichert?
    Fehlzeit.find({maNr: fe_ma, $or: [{von: {$lte: fe_von, $gte: fe_bis}}, {bis: {$gte: fe_von, $lte: fe_bis}}]}
        , function (err, fehlzeitfind) {
            if (err) {
                var meldung = "Es existiert schon eine Fehlzeit im Zeitraum: " + fe_von + "-" + fe_bis;
                res.render('absences/feHinzufuegen', {Meldung: meldung, maNummer: req.query.maNr});
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