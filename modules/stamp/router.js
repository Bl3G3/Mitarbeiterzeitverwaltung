/**
 * Created by Basti on 09.05.2017.
 */
var express = require('express');
var passport = require('passport');
var auth_middleware = require('../auth/middleware')
var employees = require('../../models/employees');
var stamps = require('../../models/stamps')
var router = express.Router();


// todo:
// 3X get - all zeros, ma selected, ma && stamp to change selected
// 2x post - ma select criteria -search ma ,
//          select criteria stamps selected - needs resend selected ma
// whatever change stamp is..


// /admin only for hr's..
router.all('/admin', function (req, res, next) {
    auth_middleware.onlyHR(req, res, next);
    next();
});

router.get('/admin', function (req, res, next) {
    if (req.param('selected_employee')){
        next();
    }
    res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user});
});

router.get('/admin', function (req, res, next) {
    if (req.param('selected_stamp')){
        next();
    }
    res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, selected_employee:req.param('selected_employee')});
});

router.get('/admin', function (req, res) {

    // TODO:
    // rewrite, when change stamp is implemented
    res.render('stamp/stamps', {
        title: 'Zeitstempel',
        user:req.user,
        selected_employee:req.param('selected_employee'),
        selected_stamp: req.param('selected_stamp')});
});

router.post('/admin', function (req, res, next) {
    if (req.body.fromdate || req.body.tilldate){
        next();
    }

    if (req.body.employee_no || req.body.first_name || req.body.last_name){
        employees.readList(req.body.employee_no,req.body.first_name,req.body.last_name, function (err, list) {
            res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, employee_list:list});
        });
    }
});
router.post('/admin', function (req, res) {
   if (req.body.fromdate && req.body.tilldate){
       stamps.readList(req.param('selected_employee'), req.body.fromdate,req.body.tilldate, function (err, list) {
           if (err) callback(err);
           else {
               // console.log(list);
               res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, selected_user:req.param('selected_employee'), stamplist:list});
           }
       } );
   }
});

// user mode - only employee needed (is caught in appjs)
router.get('/', function (req, res, next) {
    if (req.param('selected_stamp')){
        next();
    }
    //params all zeros - render empty stamps page
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


// router.post('/admin', function (req, res) {
//     //either got ma-search criteria - resend page with selected MAs
//     // or got search criterias for stamps - selected MA within the link
//     if (req.param('selected_employee')){
//         //    employee is selected, eventually got search params for stamps
//         stamps.readList(req.param('selected_employee'), req.body.fromdate,req.body.tilldate, function (err, list) {
//             if (err) callback(err);
//             else {
//                 console.log(list);
//                 res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, selected_user:req.param('selected_employee'), stamplist:list});
//             }
//         } );
//     }
//
//
// });
//
// // user mode - only employee needed (is caught in appjs)
// router.get('/', function (req, res, next) {
//     if (req.param('selected_stamp')){
//         next();
//     }
//     //params all zeros - render empty stamps page
//     res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user});
// });
//
// router.post('/', function (req, res) {
//
//     stamps.readList(req.user.employee_no, req.body.fromdate,req.body.tilldate, function (err, list) {
//         if (err) callback(err);
//         else {
//             console.log(list)
//             res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, stamplist:list});
//         }
//     } );
//
// });
//
//
//
//
// router.get('/admin', function (req, res) {
//     //return page with chosen employee
//     // console.log("routing get /admin found");
//     res.render('stamp/stamps', {title: 'Zeitstempel', theurl:req.originalUrl , user:req.user, selected_user:0});
//
// });
//
// router.post('/admin', function (req, res) {
//     //either got ma-search criteria - resend page with selected MAs
//     // or got search criterias for stamps - selected MA within the link
//     if (req.param('selected_employee')){
//     //    employee is selected, eventually got search params for stamps
//         stamps.readList(req.param('selected_employee'), req.body.fromdate,req.body.tilldate, function (err, list) {
//             if (err) callback(err);
//             else {
//                 console.log(list);
//                 res.render('stamp/stamps', {title: 'Zeitstempel', user:req.user, selected_user:req.param('selected_employee'), stamplist:list});
//             }
//         } );
//     }
//
//
// });
//
//
// router.post('/example', function(req, res){
//     var mitarbeiter = new Mitarbeiter();
//     mitarbeiter.mitarbeiternummer = req.body.manr;
//     mitarbeiter.vorname = req.body.forname;
//     mitarbeiter.name = req.body.surname;
//
//     var query = {};
//     if (mitarbeiter.mitarbeiternummer)
//         query.mitarbeiternummer = mitarbeiter.mitarbeiternummer;
//     if (mitarbeiter.vorname)
//         query.vorname = mitarbeiter.vorname;
//     if (mitarbeiter.name)
//         query.nachname = mitarbeiter.name;
//     if (query){
//         Mitarbeiter.find(query, function(err, mas) {
//             if (err)
//                 console.log(err);
//
//             console.log(mas.length);
//             res.render('index', { title: 'Express', lastaction: 'Eingestempelt', mitarbeiter: mitarbeiter, malist:mas});
//         });
//     } else
//         res.render('index', { title: 'Express', lastaction: 'Eingestempelt', mitarbeiter: mitarbeiter});
//
// });
//
// // router.get('/employee', function (req, res) {
// //
// //     res.render('index', { title: 'Express', lastaction: 'Eingestempelt', user:userData.getUserData()});
// //
// //     res.render('index', {title: 'Home'});
// // });
// //
// // router.post('/employee', function (req, res) {
// //
// //     res.render('index', { title: 'Express', lastaction: 'Eingestempelt', user:userData.getUserData()});
// //
// //     res.render('index', {title: 'Home'});
// // });

module.exports = router;
