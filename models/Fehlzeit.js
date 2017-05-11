// Load required packages
var mongoose = require('mongoose');

// Define our article schema
var FehlzeitenSchema = new mongoose.Schema({
    von: {type: Date, required: true},
    bis: {type: Date, required: true},
    kategorie: {type: String, required: true},
    maNr: {type: Number, required: true}
});

FehlzeitenSchema.index({von: 1, bis: 1}, {unique: true});

// Export the Mongoose model
module.exports = mongoose.model('Fehlzeit', FehlzeitenSchema);


