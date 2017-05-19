var express = require('express');
var Fehlzeit = require('../models/Fehlzeit');
var model = require('../modules/absences/ap2model.js');

var router = express.Router();

const Error_Missing_Input = "Es haben Eingaben gefehlt bitte versuchen sie es erneut";
const Message_NoDelete = "Löschung findet nicht statt";
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

router.get('/maSuchen', function (req, res) {
    var emptylist = [];
    //Mit diesen Parametern maSuchen aufrufen um die Richtige Seite zu generieren
    //req.query.tableHeader;
    //req.query.linkName; //So heißt der text in der Tabelle
    //req.query.link
    //req.query.siteHeadline;
    if (req.query.tableHeader === undefined || req.query.linkName === undefined || req.query.link === undefined || req.query.siteHeader === undefined) {
        res.send("Es ist ein unerwarteter Fehler aufgetreten");
    } else {
        if (req.query.vorname === undefined || req.query.nachname === undefined) {
            console.log(req.query.link);
            res.render('temp/maSuchen', {
                tableHeader: req.query.tableHeader,
                linkName: req.query.linkName,
                link: req.query.link,
                siteHeadline: req.query.siteHeadline,
                maList :emptylist
            });
            return;
        }
        model.getMitarbeiterbyFullName(req.query.vorname, req.query.nachname, function (error, maList, meldung) {
            if (error) {

                res.render('temp/maSuchen', {
                    tableHeader: req.query.tableHeader,
                    linkName: req.query.linkName,
                    link: req.query.link,
                    siteHeadline: req.query.siteHeadline,
                    Meldung: meldung,
                    searchFirstName: req.query.vorname,
                    searchLastName: req.query.nachname,
                    maList:emptylist
                });
            } else {
                res.render('temp/maSuchen', {
                    tableHeader: req.query.tableHeader,
                    linkName: req.query.linkName,
                    link: req.query.link,
                    siteHeadline: req.query.siteHeadline,
                    maList: maList,
                    suche_vorname: req.query.vorname,
                    suche_nachname: req.query.nachname
                });
            }
        });
    }
});

router.get('/fe', function (req, res) {
    if (req.query.maNr === undefined) {
        res.render('employeeSearch/maSuchen');
    } else {
        if (req.query.such_date === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        } else {//Fehlzeit suchen!
            Fehlzeit.findByDate(req.query.such_date, req.query.maNr, function (error, feList, meldung) {
                if (error) {
                    res.render('absences/fePlain', {
                        Meldung: meldung,
                        maNr: req.query.maNr,
                        suchDate: req.query.such_date
                    });
                } else {
                    res.render('absences/fe', {
                        feList: feList, maNr: req.query.maNr, gesuchtDate: req.query.such_date
                    })
                    ;
                }
            });
        }
    }
});

router.get('/feDelete', function (req, res) {
    if (req.query.feId === undefined || req.query.maNr === undefined) {
        if (req.query.maNr === undefined) {
            res.render('employeeSearch/maSuchen');
        } else if (req.query.feId === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        }
    } else {
        res.render('absences/feDelete', {deleteMaNr: req.query.maNr, deleteFeId: req.query.feId});
    }
});

router.get('/feDeleteA', function (req, res) {
    if (req.query.feId === undefined || req.query.maNr === undefined) {
        if (req.query.maNr === undefined) {
            res.render('employeeSearch/maSuchen');
        } else if (req.query.feId === undefined) {
            res.render('absences/fePlain', {maNr: req.query.maNr});
        }
    } else {
        if (req.query.delete === undefined) {
            res.render('absences/feDelete', {deleteMaNr: req.query.maNr, deleteFeId: req.query.feId});
        } else {
            if (req.query.delete === "1") {
                Fehlzeit.deleteFeById(req.query.feId, function (error, message) {
                    if (error) {
                        res.render('absences/feDeleteA', {
                            Meldung: message,
                            deleteMaNr: req.query.maNr,
                            deleteFeId: req.query.feId
                        });
                    } else {
                        res.render('absences/feDeleteA', {Meldung: message, maNr: req.query.maNr});
                    }
                });
            } else {
                res.render('absences/feDeleteA', {Meldung: Message_NoDelete, maNr: req.query.maNr});
            }
        }
    }
});

router.get('/feAendern', function (req, res) {
    if (req.query.feId === undefined || req.query.maNr === undefined) {
        if (req.query.maNr === undefined) {
            res.render('employeeSearch/maSuchen');
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
        res.render('employeeSearch/maSuchen');
    } else if (req.query.feId === undefined) {
        res.render('absences/fePlain', {maNr: req.query.maNr});
    } else if (req.query.new_vondate === undefined || req.query.new_bisdate === undefined || req.query.new_kat === undefined) {
        res.render('absences/fePlain', {
            maNr: req.query.maNr,
            Meldung: Error_Missing_Input
        });
    } else {
        Fehlzeit.saveById(req.query.feId, req.query.new_vondate, req.query.new_bisdate, req.query.new_kat, function (error, fehlzeit, meldung) {
            if (error) {
                res.render('absences/feAendernA', {
                    Meldung: meldung,
                    maNr: req.query.maNr
                });
            } else {
                res.render('absences/feAendernA', {Meldung: meldung, maNr: req.query.maNr});
            }
        });
    }
});


router.get('/feHinzufuegen', function (req, res) {
    if (req.query.maNr === undefined) {
        res.render('employeeSearch/maSuchen');
    } else {
        res.render('absences/feHinzufuegen', {maNummer: req.query.maNr});
    }
});

router.get('/feHinzufuegenA', function (req, res) {
    if (req.query.maNr === undefined) {
        res.render('employeeSearch/maSuchen');
    } else {
        if (req.query.vondate === undefined || req.query.bisdate === undefined || req.query.kat === undefined) {
            res.render('absences/feHinzufuegen', {maNummer: req.query.maNr, Meldung: Error_Missing_Input});
        } else {
            Fehlzeit.saveByParam(req.query.vondate, req.query.bisdate, req.query.kat, req.query.maNr, function (error, meldung) {
                if (error) {
                    res.render('absences/feHinzufuegen', {
                        Meldung: meldung,
                        maNummer: req.query.maNr,
                        setVonDate: Fehlzeit.getHTMLdate(req.query.vondate),
                        setBisDate: Fehlzeit.getHTMLdate(req.query.bisdate),
                        setkat: req.query.kat
                    })
                } else {
                    res.render('absences/feHinzufuegenA', {Meldung: meldung, maNummer: req.query.maNr});
                }
            });
        }
    }
});

module.exports = router;