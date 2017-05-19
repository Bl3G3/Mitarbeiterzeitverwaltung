/**
 * Created by Basti on 09.05.2017.
 */
var express = require('express');
var passport = require('passport');
var stamps = require('../../models/stamps')
var router = express.Router();
const url = require('url');

router.get('/admin', function (req, res, next) {
    if (!req.param('maNr')){
        res.redirect('/ap2/maSuchen');
    }
    next();

});

router.get('/admin', function (req, res, next) {
    if (req.param('maNr') && !req.param('fromDate')){
        res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, selected_employee:req.param('maNr'), theurl: req.originalUrl});
    }
    console.log(req.originalUrl);
    next();

});

router.get('/admin', function (req, res) {
    if (req.param('maNr') && req.param('fromDate') && req.param('tillDate')){
        stamps.readList(req.param('maNr'), req.param('fromDate'),req.param('tillDate'), function (err, list) {
            if (err) {
                if (err == 'fromdate') res.send('Ungültiges Datum \"Von\"!');
                if (err == 'tilldate') res.send('Ungültiges Datum \"Bis\"!');
                console.log(err);
            }
            else {
                res.render('stamp/stamps', {
                    title: 'Zeitstempel',
                    user:req.user,
                    theurl: req.originalUrl,
                    selected_employee:req.param('maNr'),
                    stamplist:list,
                    fromDate:req.param('fromDate'),
                    tillDate:req.param('tillDate')});
            }
        } );
    }
});

router.get('/admin/change', function (req, res) {
    if (req.param('stamp_no') && req.param('maNr')){
        stamps.read(req.param('stamp_no'), req.param('maNr'), function (err, doc) {
            if (err) console.log(err)
            else res.render('stamp/changestamp', {
                title: 'Zeitstempel ändern',
                user:req.user,
                stamp:doc,
                selected_employee:req.param('maNr'),
                fromDate:req.param('fromDate'),
                tillDate:req.param('tillDate')})
        })
    }
});

router.post('/admin/change', function (req, res) {
    if (req.body.stampTime){
        console.log("Input Time: " + req.body.stampTime);
        stamps.updateTime(req.body.stamp_no, req.body.maNr, req.body.stampTime, function (err) {
            if (err) {
                console.log(err);
                res.send("Fehler beim speichern");
            } else {
                res.redirect('/stamps/admin?' +
                    'maNr=' + req.body.maNr +
                    '&fromDate=' + req.body.fromDate +
                    '&tillDate=' + req.body.tillDate);

            }
        });
    }

});


// user mode - only employee needed
router.get('/', function (req, res, next) {
    if (!req.param('fromDate') || !req.param('tillDate')){
        res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, theurl: url.parse(req.originalUrl).pathname});
    }
    next();
});

router.get('/', function (req, res, next) {
    if (!req.param('fromDate' && req.param('tillDate'))){
        stamps.readList(req.user.employee_no, req.body.fromdate,req.body.tilldate, function (err, list) {
            if (err) res.send(err);
            else {
                // console.log(list)
                res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, stamplist:list, theurl: url.parse(req.originalUrl).pathname });
            }
        } );
    }
});




module.exports = router;
