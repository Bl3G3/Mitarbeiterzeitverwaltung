// Load required packages
var mongoose = require('mongoose');

// Define our article schema
var FehlzeitenSchema = new mongoose.Schema({
    von: {type: Date, required: true},
    bis: {type: Date, required: true},
    kategorie: {type: String, required: true},
    maNr: {type: Number, required: true}
});
// Export the Mongoose model
FehlzeitenSchema.index({von: 1, bis: 1}, {unique: true});

var Fehlzeit = mongoose.model('Fehlzeit', FehlzeitenSchema);
module.exports = Fehlzeit;



module.exports.getFeById = function (_id, callback) {
    var id = require('mongodb').ObjectID(_id);
    Fehlzeit.findOne({_id: id}, function (error, fe) {
        if (error) {
            callback(error);
            return;
        }
        callback(null, fe);
    });
};

module.exports.getHTMLdate = function (mongodate) {
    var von = new Date(mongodate);
    von = von.toISOString().slice(0, 10);
    return von;
};






