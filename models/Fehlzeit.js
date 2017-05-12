// Load required packages
var mongoose = require('mongoose');

//Fehlermeldungen
const Fehler_StartEndFalsch = "Die Fehlzeit muss mindestens einen Tag dauern";
const Fehler_FehlzeitZeitraum = "Es gibt in diesem Zeitraum schon eine Fehlzeit//im Pflichtenheft anders";
const Fehler_DatenUngueltig = "Bitte geben sie ein gültiges Datum ein";
const Fehler_Speicherung = "Die Speicherung war nicht erfolgreich";
const Fehler_LoeschenSpeicher = "Die Löschung schlug fehl";
const Fehler_LoeschenAbbruch = "Die Löschung findet nicht statt";
const Fehler_SucheNachId = "Zu der Id gibt es keine Fehlzeit";
const Fehler_SucheNachDate = "In diesem Zeitraum gibt es keine Fehlzeit";
const Fehler_unexpected = "Es ist ein unerwarteter Fehler aufgetreten";

//Meldungen
const Meldung_Speicherung = "Die Speicherung war erfolgreich";
const Meldung_Loeschen = "Die Löschung war erfolgreich";


// Define our article schema
var FehlzeitenSchema = new mongoose.Schema({
    von: {type: Date, required: true},
    bis: {type: Date, required: true},
    kategorie: {type: String, required: true},
    maNr: {type: Number, required: true}
});
// Export the Mongoose model
FehlzeitenSchema.index({von: 1, bis: 1}, {unique: true});
var Fehlzeit = mongoose.model('Fehlzeit', FehlzeitenSchema);//Deklaration for further definitions
module.exports = Fehlzeit;

module.exports.check = function (fehlzeit, callback) {
    //TODO Start Endzeitpunk falsch Meldung "Die Fehlzeit muss mindestens einen Tag dauern"
    //TODO Es existiert eine Fehlzeit innerhalb des Zeitraums Meldiung "Es gibt in diesem Zeitraum schon eine Fehlzeit//im Pflichtenheft anders"
    //TODO Die Daten sind undgültig Meldung " Bitte geben sie ein gültiges Datum ein"
    //TODO Speicherung nicht erfolgreich --> Fehlmeldung
    callback(null, "Fehlertext");
};

module.exports.getFeById = function (_id, callback) {
    var id = require('mongodb').ObjectID(_id);
    Fehlzeit.findOne({_id: id}, function (error, fe) {
        if (error) {
            callback(error, fe, Fehler_SucheNachId);
            return;
        }
        callback(null, fe);
    });
};
module.exports.timeRangeCheck = function (fehlzeit, callback) {
    //TODO implementieren
    callback(null, "schlaue Meldung, dass sie schon existiert");
};

module.exports.saveById = function (_id, _von, _bis, _kat, callback) {
    var id = require('mongodb').ObjectID(_id);
    Fehlzeit.findOne({_id: id}, function (error, fe) {
        if (error) {
            callback(error, fe, Fehler_SucheNachId);
        } else {
            fe.von = _von;
            fe.bis = _bis;
            fe.kategorie = _kat;

            Fehlzeit.check(fe, function (error, meldung) {
                if (error) {
                    callback(error, meldung);
                } else {
                    fe.save(function (error2) {
                        if (error2) {
                            callback(error2, fe, Fehler_Speicherung);
                        } else {
                            callback(null, fe, Meldung_Speicherung);
                        }
                    });
                }
            });
        }
    });
};

module.exports.getHTMLdate = function (mongodate) {
    var von = new Date(mongodate);
    von = von.toISOString().slice(0, 10);
    return von;
};

module.exports.findByDate = function (search_date, search_maNr, callback) {
    Fehlzeit.find(
        {
            maNr: search_maNr,
            von: {$lte: search_date},
            bis: {$gte: search_date}
        }).exec(function (err, feList) {
        if (err) {
            callback(err, feList, Fehler_unexpected);
        } else {
            if (feList.length === 0) {
                callback(true, feList, Fehler_SucheNachDate);
            } else {
                callback(null, feList);
            }
        }
    });
};

module.exports.deleteFeById = function (fe_Id, callback) {
    var id = require('mongodb').ObjectID(fe_Id);
    Fehlzeit.findOne({_id: id}, function (error, fe) {
        if (error) {
            callback(error, Fehler_unexpected);
        } else {
            if (fe === null) {
                callback(true, Fehler_SucheNachId);
            }
            else {
                fe.remove(function (error) {
                    if (error) {
                        callback(error, Fehler_LoeschenSpeicher);
                    } else {
                        callback(null, Meldung_Loeschen);
                    }
                });
            }
        }
    });
};




