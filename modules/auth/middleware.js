var login_url = '/auth/login';


module.exports.loadUserIntoLocals = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();
};

module.exports.onlyEmployees = function(req, res, next) {
    // the login url must always be reachable, even when this function is i.e.
    // added as app.use() middleware for all urls
    if (req.url === login_url){
        return next()
    }
    if (req.user) {
        return next();
    }
    return res.redirect(login_url);
};

module.exports.onlyHR = function(req, res, next) {
    // fist test if logged in and test for hr only in case of success
    module.exports.onlyEmployees(req, res, function (req, res) {
        if (req.user.hr) {
            return next();
        }
        // send non hr-employees trying to access the url to the start page
        return res.redirect("/");
    });
};