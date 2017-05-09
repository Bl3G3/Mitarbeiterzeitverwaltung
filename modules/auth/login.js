module.exports.renderLogin = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect("/");
    }

    res.render('auth/login', {
        title: 'Login',
        //user: req.user,
        message: req.flash('error')
    });
};

module.exports.afterLogin = function(req, res) {
    res.redirect('/');
};

module.exports.doLogout = function(req, res){
    req.logout();
    res.redirect('/');
};