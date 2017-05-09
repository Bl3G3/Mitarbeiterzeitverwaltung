var express = require('express');
var passport = require('passport');
var employees = require('../../models/mongoose/employees');
var router = express.Router();


router.get('/', function (req, res) {
    //var exists = req.i18n.exists('hello');
    //var h = res.t('hello');
    res.render('home/home', {title: 'Home'});
});

module.exports = router;
