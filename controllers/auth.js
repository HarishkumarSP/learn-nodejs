const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    console.log(req.session)
    res.render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.postLogin = (req, res, next) => {
    User.findById("678f7eece991411bc4a29b42")
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            res.redirect('/')
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err, 'error')
        res.redirect('/')
    })
};
