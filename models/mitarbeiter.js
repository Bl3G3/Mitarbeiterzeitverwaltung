
var mongoose = require('mongoose');

var Mitarbeiterschema = mongoose.Schema({
    mitarbeiternummer: Number,
    name: String,
    vorname: String,
    strasse: String,
    ort: String,
    telefon: Number,
    email: String,
    abteilung: String,
    rechte: Boolean,

    benutzername: String,
    passwort: String
});


module.exports = mongoose.model('Mitarbeiter', Mitarbeiterschema, 'Mitarbeiter');
