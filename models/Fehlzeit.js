// Load required packages
var mongoose = require('mongoose');

// Define our article schema
var FehlzeitenSchema   = new mongoose.Schema({
  von: Date,
  bis: Date,
  kategorie: String,
  maNr: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Fehlzeit', FehlzeitenSchema);


