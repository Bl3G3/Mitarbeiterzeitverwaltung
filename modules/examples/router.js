var express = require('express');
var passport = require('passport');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('examples/table', {});
});

router.get('/article', function (req, res) {
    res.render('examples/article', {});
});



module.exports = router;