// var express = require('express');
// var passport = require('passport');
// var login = require('./login');
// var middleware = require('./middleware');
// var router = express.Router();
//
//
// router.get('/login',
//     login.renderLogin);
//
// router.post('/login',
//     passport.authenticate('local', {
//         failureRedirect: 'login', failureFlash: true
//     }), login.afterLogin);
//
// router.get('/logout',
//     login.doLogout);
//
// router.get('/logged-in-test',
//     middleware.onlyEmployees, function (req, res) {
//         res.json({"logged_in": true});
//     });
//
// router.get('/hr-test',
//     middleware.onlyEmployees, middleware.onlyHR, function (req, res) {
//         res.json({"logged_in": true, "hr": true});
//     });
//
//
//
//
// module.exports = router;