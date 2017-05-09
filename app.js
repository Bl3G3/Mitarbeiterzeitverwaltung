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


var db_config = require('./db_config');
var db = require('./models/mongoose/db');
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
var example_router = require('./modules/examples/router');
var home_router = require('./modules/home/router');




var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var session_ttl = 30; // 30 min
app.use(session({
    secret: 'o8u98zqoijfd8254afasdfas98377749lsnczuk934',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: session_ttl*60*1000, secure: false },
    store: new MongoStore({
        mongooseConnection: db.getMongoose().connection,
        ttl: session_ttl * 60 // = min
        //ttl: 10 // = 10 sek
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



//static files
app.use(express.static(path.join(__dirname, 'public')));

//landing page router
// app.use('/', index);
app.get('/', function (req, res) {
    res.redirect('/home');
});


//module router
app.use('/auth', auth_router);
app.use('/examples', example_router);
app.use('/home', auth_middleware.onlyEmployees, home_router);
// insert new module routers here!

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
  mongoose.mode
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
