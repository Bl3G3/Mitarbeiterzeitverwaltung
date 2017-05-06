var express = require('express');
var router = express.Router();

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/my_db');
//
// var mitarbeiter = mongoose.Schema({
//     mitarbeiternummer: Number,
//     name: String,
//     vorname: String,
//     strasse: String,
//     ort: String,
//     telefon: Number,
//     email: String,
//     abteilung: String,
//     rechte: Boolean,
//
//     benutzername: String,
//     passwort: String
// });
// var Mitarbeiter = mongoose.model("Mitarbeiter", mitarbeiter);


/* GET home page. */
router.get('/', function(req, res, next) {
    // var newMitarbeiter = new Mitarbeiter({
        // mitarbeiternummer: 3,
        // name: "Alkin",
        // vorname: "Alfons",
        // strasse: "Albertstraße 1",
        // ort: "Aichingen",
        // telefon: 012345611,
    //     email: "Alfons.Alkin@aol.com",
    //     abteilung: "A",
    //     rechte: false,
    //
    //     benutzername: "Alfons",
    //     passwort: "Alfons"
    // });
    // newMitarbeiter.save(function (err, Mitarbeiter) {
    //     if(err)
    //         res.render('show_message', {message: "Database error", type: "error"});
    //     else
    //         res.render('index', { title: 'Express', lastaction: 'Eingestempelt'});
    // })
  res.render('index', { title: 'Express', lastaction: 'Eingestempelt'});
});

module.exports = router;
