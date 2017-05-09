/**
 * Created by blackgear on 09.05.17.
 */

var mongoose = require('mongoose');

var Zeitstempelschema = mongoose.Schema({
    mitarbeiternummer: Number,
    stempelart: Number,
    timestamp: Date
});


module.exports = mongoose.model('Zeitstempel', Zeitstempelschema, 'Zeitstempel');
