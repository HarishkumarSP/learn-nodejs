const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message;
	} else {
		message = null;
	}
	res.render("auth/login", {
		pageTitle: "Login",
		path: "/login",
		errorMessage: message,
	});
};

exports.postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	User.findOne({ email })
		.then(user => {
			if (!user) {
				req.flash("error", "Invalid email or password");
				return res.redirect("/login");
			}
			bcrypt
				.compare(password, user.password)
				.then(isMatch => {
					if (isMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(() => {
							res.redirect("/");
						});
					}
					req.flash("error", "Invalid email or password");
					res.redirect("/login");
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
	req.session.destroy(err => {
		console.log(err, "error");
		res.redirect("/");
	});
};

exports.getSignup = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message;
	} else {
		message = null;
	}
	res.render("auth/signup", {
		pageTitle: "Signup",
		path: "/signup",
		errorMessage: message,
	});
};

exports.postSignup = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email })
		.then(userData => {
			if (userData) {
				req.flash("error", "Email already exists");
				return res.redirect("/signup");
			}
			const hashedPassword = bcrypt.hash(password, 12);
			return hashedPassword
				.then(hashedPassword => {
					const user = new User({
						email,
						password: hashedPassword,
						cart: { items: [] },
					});
					return user.save();
				})
				.then(() => {
					res.redirect("/login");
				});
		})
		.catch(err => console.log(err));
};
