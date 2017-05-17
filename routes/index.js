var express = require('express');
var router = express.Router();
//var Mitarbeiter = require('../models/employees');
var stamps = require('../models/stamps')

/* GET home page. */
router.get('/', function(req, res, next) {

    if (req.user){
        stamps.readLast(req.user.mitarbeiternummer, function (err, doc) {
            if (!err)
            {
                res.render('index', {
                    title: 'Home',
                    last_stamp:doc,
                    user:req.user
                });
            } else {
                res.render('index', {
                    title: 'Home',
                    user:req.user
                });
            }

        });
    } else {
        //TODO
        //You are not logged in!
        res.render('index', {
            title: 'Home',
            user:req.user
        });
    }


});

router.get('/newstamp', function (req, res, next) {
    if (req.user){
        stamps.create(req.user.mitarbeiternummer, function (err) {
            if (err)console.log(err);
            res.redirect('/home');

        });
    } else {
        res.redirect('/home');
    }

});

module.exports = router;





