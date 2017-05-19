var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;


var Mitarbeiterschema = Schema({
    mitarbeiternummer: {type: Number, required: true, unique: true},
    nachname: {type:String, required: true},
    vorname: {type:String, required: true},
    aktiv: {type:Boolean, required: true},
    strasse: String,
    ort: String,
    telefon: Number,
    email: String,
    abteilung: String,
    rechte: Boolean,

    benutzername: String,
    passwort: String
});
Mitarbeiterschema.methods.set_password = function(password, callback) {
    //use bcrypt to encrypt password
    this.password = bcrypt.hashSync(password);
    return callback();
};

//create exported Model
mongoose.model('Mitarbeiter', Mitarbeiterschema, 'Mitarbeiter');
var Mitarbeiter = mongoose.model('Mitarbeiter');
exports.Mitarbeiter = Mitarbeiter;

exports.create = function(mitarbeiternummer, vorname, nachname, aktiv, strasse, ort, telefon, email, abteilung, persorechte, benutzername, callback) {
    // keine Prüfung auf doppelte!
    var newMitarbeiter = new Mitarbeiter();
    newMitarbeiter.mitarbeiternummer = mitarbeiternummer;
    newMitarbeiter.vorname = vorname;
    newMitarbeiter.nachname = nachname;
    newMitarbeiter.aktiv = aktiv;
    newMitarbeiter.strasse = strasse;
    newMitarbeiter.ort = ort;
    newMitarbeiter.telefon = telefon;
    newMitarbeiter.email = email;
    newMitarbeiter.abteilung = abteilung;
    newMitarbeiter.rechte = perso;
    newMitarbeiter.benutzername = benutzername;
    newMitarbeiter.save(function(err) {
        if (err)
        {
            callback(err);
        }
        else
        {callback();}
    });
};

// just like the function above - id is not set by param, but by the function itself
exports.createNext  = function(vorname, nachname, aktiv, strasse, ort, telefon, email, abteilung, persorechte, benutzername, callback) {
    exports.readLastID(function (err, id) {
        var newMitarbeiter = new Mitarbeiter();
        newMitarbeiter.mitarbeiternummer = id +1;
        newMitarbeiter.vorname = vorname;
        newMitarbeiter.nachname = nachname;
        newMitarbeiter.aktiv = aktiv;
        newMitarbeiter.strasse = strasse;
        newMitarbeiter.ort = ort;
        newMitarbeiter.telefon = telefon;
        newMitarbeiter.email = email;
        newMitarbeiter.abteilung = abteilung;
        newMitarbeiter.rechte = perso;
        newMitarbeiter.benutzername = benutzername;
        newMitarbeiter.save(function(err) {
            if (err)
            {
                callback(err);
            }
            else
            {callback();}
        });
    });

};

//read last id, to create new employees
exports.readLastID = function (callback) {
    Mitarbeiter.find({}, {limit:1, sort: {mitarbeiternummer: -1}}, function (err, doc) {
        callback(err, doc[0].mitarbeiternummer);
    });
};


exports.update = function(mitarbeiternummer, vorname, nachname, aktiv, strasse, ort, telefon, email, abteilung, persorechte, benutzername, callback) {
    // get object to change and override
    exports.read(id, function(err, doc) {
        if (err) callback(err);
        else {
            //manr kann nicht geändert werden
            //doc.mitarbeiternummer = mitarbeiternummer;
            doc.vorname = vorname;
            doc.nachname = nachname;
            doc.aktiv = aktiv;
            doc.strasse = strasse;
            doc.ort = ort;
            doc.telefon = telefon;
            doc.email = email;
            doc.abteilung = abteilung;
            doc.rechte = perso;
            doc.benutzername = benutzername;

            doc.save(function(err) {
                if (err) callback(err);
                else
                    callback();
            });
        }
    });
};

exports.set_password = function(id, password, callback) {
    exports.read(id, function(err, doc) {
        if (err) callback(err);
        else {
            doc.set_password = password;
            doc.save(function(err) {
                if (err) callback(err);
                else
                    callback();
            });
        }
    });
};

exports.read = function(id, callback) {
    Mitarbeiter.findOne({ mitarbeiternummer: id }, function(err, doc) {
        callback(err,doc);
    });
};

exports.existsduplicate = function (vorname,nachname, callback)
{
    //irgendwie nach namen suchen
    Mitarbeiter.findOne({vorname: vorname, nachname: nachname},function (err,doc) {

        if(doc)
        {
            console.log("No duplicate.");
            //console.log(users[0]);
            callback(false);

        }
        else
        {
            console.log("duplicate exists.");
            callback(true);
        }

    });

};



// exports.model = mongoose.model('Mitarbeiter', Mitarbeiterschema, 'Mitarbeiter');


