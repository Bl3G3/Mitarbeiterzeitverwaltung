/**
 * Created by phl on 12.05.17.
 */
var express = require('express');
var Fehlzeit = require('../../models/Fehlzeit');
var Mitarbeiter = require('../../models/mitarbeiter');

//Fehlermeldungen
const Fehler_getMitarbeiterByFullName_NoMa = "Es konnte kein Mitarbeiter gefunden werden";
const Fehler_getMitarbeiterByFullName_unexpected = "Es ist ein unerwarteter Fehler aufgetreten";

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