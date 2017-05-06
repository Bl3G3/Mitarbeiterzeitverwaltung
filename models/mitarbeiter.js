

var mitarbeiter = mongoose.Schema({
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

