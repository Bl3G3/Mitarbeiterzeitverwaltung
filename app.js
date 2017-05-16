require('./models/mitarbeiter');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');

var db_config = require('./dbconfig');
var db = require('./models/db');
db.connect(db_config.url);

const MongoStore = require('connect-mongo')(session);

var auth_serialize = require('./modules/auth/serialize_user');
var auth_strategy = require('./modules/auth/strategy');

// passport setup
passport.serializeUser(auth_serialize.serialize);
passport.deserializeUser(auth_serialize.deserialize);
passport.use(auth_strategy.strategy);

// module middleware
var auth_middleware = require('./modules/auth/middleware');

// module routers
var auth_router = require('./modules/auth/router');
var stamps_router = require('./modules/stamp/router');
var index = require('./routes/index');
var ap2 = require('./routes/ap2');
var neumitarbeiter = require('./routes/neumitarbeiter');

var app = express();

//mongoose.connect('mongodb://localhost/node-comment');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
var session_ttl = 30; // 30 min
app.use(session({
    secret: 'o8u98zqoijfd8254afasdfas98377749lsnczuk934',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: session_ttl * 60 * 1000, secure: false},
    store: new MongoStore({
        mongooseConnection: db.getMongoose().connection,
        ttl: session_ttl * 60 // = min
        //ttl: 10 // = 10 sek
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());http://stackoverflow.com/questions/8623205/node-js-error-error-cannot-find-module-mongoose

//static files
app.use(express.static(path.join(__dirname, 'public')));

//landing page router
// app.use('/', index);
app.get('/', function (req, res) {
    res.redirect('/home');
});
//module router
app.use('/auth', auth_router);
app.use('/home', auth_middleware.onlyEmployees, index);
app.use('/stamps',auth_middleware.onlyEmployees, stamps_router);
//app.use('/ap2', auth_middleware.onlyHR, ap2);
app.use('/ap2',ap2);
// insert new module routers here!
app.use('/neumitarbeiter', neumitarbeiter);
app.use('/create', neumitarbeiter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
    mongoose.mode
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
 //app.listen(3000, function () {
 //    console.log('Example app listening on port 3000!')
 //});

module.exports = app;
