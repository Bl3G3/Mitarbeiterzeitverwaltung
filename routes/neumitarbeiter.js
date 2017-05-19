var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Mitarbeiter = mongoose.model('Mitarbeiter');


/* GET neumitarbeiter */
router.get('/', function(req, res, next) {
  Mitarbeiter.Mitarbeiter.find(function(err, comments){
    console.log(comments)
    res.render('neumitarbeiter', { title: 'Neuen Mitarbeiter anlegen', comments : comments });
});
});


/* POST neumitarbeiter */
router.post('/', function(req, res) {
  new Mitarbeiter.Mitarbeiter({mitarbeiternummer : req.body.mitarbeiternummer,
               nachname : req.body.nachname,
               vorname : req.body.vorname,
               aktiv : req.body.aktiv,
               strasse : req.body.strasse,
               ort : req.body.ort,
               telefon : req.body.telefon,
               email : req.body.email,
               abteilung : req.body.abteilung,
               rechte : req.body.rechte,
               benutzername : req.body.benutzername,
               passwort : req.body.passwort})
  .save(function(err, comment) {
    console.log(comment)
    res.redirect('neumitarbeiter');
  });
});


module.exports = router;
