var express = require('express');
var passport = require('passport');

var router = express.Router();


router.get('/', function (req, res) {
    //var exists = req.i18n.exists('hello');
    //var h = res.t('hello');


    res.render('index', { title: 'Express', lastaction: 'Eingestempelt', user:userData.getUserData()});

    res.render('index', {title: 'Home'});
});

module.exports = router;
