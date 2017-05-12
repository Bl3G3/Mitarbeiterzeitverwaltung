/**
 * Created by phl on 12.05.17.
 */
var express = require('express');
var Fehlzeit = require('../../models/Fehlzeit');
var Mitarbeiter = require('../../models/mitarbeiter');

//Fehlermeldungen
const Fehler_getMitarbeiterByFullName_NoMa = "Es konnte kein Mitarbeiter gefunden werden";
const Fehler_getMitarbeiterByFullName_unexpected = "Es ist ein unerwarteter Fehler aufgetreten";
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



var ap2model = {type: "i am an object", color: "i am an object"};

module.exports = ap2model;

module.exports.test = function (consoleout) {
    console.log(consoleout);
    Mitarbeiter.find({}).exec(function (err, maList) {
        console.log(maList);
    });
};

module.exports.getMitarbeiterbyFullName = function (firstName, lastName, callback) {
    Mitarbeiter.find({
        nachname: lastName,
        vorname: firstName
    }).exec(function (err, maList) {



        if (err) {
            callback(err, maList, Fehler_getMitarbeiterByFullName_unexpected);
        } else {
            if (maList.length === 0) {
                callback(true, maList, Fehler_getMitarbeiterByFullName_NoMa);
            }
            else {
                callback(err, maList, "");
            }
        }
    });
};


module.exports.saveByParam = function (vondate, bisdate, kategorie, maNr, callback) {
    var fe = new Fehlzeit();
    fe.von = vondate;
    fe.bis = bisdate;
    fe.kategorie = kategorie;
    fe.maNr = maNr;
    Fehlzeit.check(fe, function (error, meldung) {
        if (error) {
            callback(error,meldung);
        } else {
            Fehlzeit.timeRangeCheck(fe, function (error, meldung) {
                if (error) {
                    callback(error, meldung);
                } else {
                    fe.save(function (err) {
                        if (err) {
                            callback(err, Fehler_Speicherung);
                        } else {
                            callback(null,Meldung_Speicherung);
                        }
                    });
                }
            })
        }
    });
};