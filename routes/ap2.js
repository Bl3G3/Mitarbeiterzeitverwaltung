var express = require('express');
var Fehlzeit = require('../models/Fehlzeit');
var Mitarbeiter = require('../models/employees');


var router = express.Router();

// middleware that is specific to this router

router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now());
  next()
});

// define the home page route
router.get('/', function (req, res) {
  res.render('main')
});
// define the about route
router.get('/maSuchen', function (req, res) {
  if(req.param('name')===undefined || req.param('vorname')===undefined)
  {res.render('maSuchen');
  return;}
  Mitarbeiter.find(function(err, maList){
  if(err) res.send(err);
  //TODO ma nach vor und nachname durchsuchen
  res.render('maSuchenList', {'maList' : maList});
  })
 
});
router.get('/fe',function(req,res){
  res.render('fe');
});

router.get('/feHinzufuegen',function(req,res){
  if(req.param('vondate')===undefined)//Muss noch abfragen
  {res.render('feHinzufuegen')}
  //Fehlzeit erstellen.
      		var fe_von = req.param('vondate');
		var fe_bis = req.param('bisdate');
		var fe_kat = req.param('kat');
		var fe_ma = req.param('maNr');
                var kat = req.param('kat');
 //Prüfung auf korrektheit
		//ist von vor bis?
		if(fe_von >= fe_bis){
			res.render('feHinzufuegen',{Meldung:"Der Start muss vor dem Ende sein"});
			return;
		}

		//Existiert dort schon eine Fehlzeit?  // geht noch nicht gescheit
		Fehlzeit.find({maNr: fe_ma , $or: [{von : {$lte : fe_von, $gte : fe_bis }}, {bis : {$gte : fe_von, $lte :fe_bis}}]}
,function(err, fehlzeitfind){
			if (err){
			var meldung = "Es existiert schon eine Fehlzeit im Zeitraum: "+fe_von +"-"+fe_bis;
			res.render('feHinzufuegen',{Meldung:meldung});
			}
		});

 //Speicherung start
		var fehlzeit = new Fehlzeit();

		fehlzeit.von = fe_von;
		fehlzeit.bis = fe_bis;
		fehlzeit.kategorie = fe_kat;
		fehlzeit.maNr = fe_ma;
		console.log(fe_von+fe_bis+fe_kat+fe_ma);
		fehlzeit.save(function(err){
			var antwort;
			if(err){
				antwort = "Die Speicherung der Fehlzeit vom" +req.param('vondate') +"-" + req.param('bisdate') +"wurde nicht erfolgreich gespeichert";
				res.render('feHinzugfuegenA',{Meldung : antwort});
			}else{
				antwort = "Die Speicherung der Fehlzeit vom"+req.param('vondate') +"-" + req.param('bisdate') +"wurde erfolgreich gespeichert";
				res.render('feHinzugfuegenA',{Meldung : antwort});
		}
		})	
});
module.exports = router;
