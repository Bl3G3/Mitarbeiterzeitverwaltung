var mongoose = require('mongoose');


exports.connect = function(dburl) {
    mongoose.Promise = global.Promise;
    var db = mongoose.connection;
    mongoose.connect(dburl);

    db.on('error', console.error.bind(console, 'connection error:'));

    mongoose.connection.on('open', function (ref) {
        console.log(ref);
        console.log('Connected to mongo server.');
    });

};

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
};

exports.getMongoose = function(){
    return mongoose;
};

// todo on error connecting - write message and don't start app (listener on connect)