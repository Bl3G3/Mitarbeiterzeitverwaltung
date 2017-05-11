/**
 * Created by Basti on 09.05.2017.
 */
var express = require('express');
var passport = require('passport');
var employees = require('../../models/employees');
var stamps = require('../../models/stamps')
var router = express.Router();


router.get('/', function (req, res) {
    res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user});
});

router.post('/', function (req, res) {
    stamps.readList(req.user.employee_no, req.body.fromdate,req.body.tilldate, function (err, list) {
        if (err) callback(err);
        else {
            console.log(list)
            res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, stamplist:list});
        }
    } );

});

router.get('/admin', function (req, res) {
    res.render('stamp/stamps', {title: 'Zeitstempel', theurl:req.originalUrl , user:req.user, selected_user:0});
});

// router.get('/employee', function (req, res) {
//
//     res.render('index', { title: 'Express', lastaction: 'Eingestempelt', user:userData.getUserData()});
//
//     res.render('index', {title: 'Home'});
// });
//
// router.post('/employee', function (req, res) {
//
//     res.render('index', { title: 'Express', lastaction: 'Eingestempelt', user:userData.getUserData()});
//
//     res.render('index', {title: 'Home'});
// });

module.exports = router;
