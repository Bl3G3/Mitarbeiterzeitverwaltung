var mongoose = require('mongoose');


exports.connect = function(dburl) {
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    mongoose.connect(dburl);

    db.on('error', console.error.bind(console, 'connection error:'));
};

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
};

exports.getMongoose = function(){
    return mongoose;
};

// todo on error connecting - write message and don't start app (listener on connect)