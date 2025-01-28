const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const crypto = require("crypto");

const transport = nodeMailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.USER_EMAIL,
		pass: process.env.USER_PASSWORD,
	},
});

const sendMail = (emailTo = "", subject = "", html = "") => {
	return transport.sendMail({
		from: process.env.USER_EMAIL,
		to: emailTo,
		subject,
		html,
	});
};

exports.getLogin = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
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
		message = message[0];
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
					const html = "<h1>You successfully signed up!</h1>";
					sendMail(email, "Signup completed!", html);
				})
				.catch(err => console.log(err));
		})
		.catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("auth/reset", {
		pageTitle: "Reset Password",
		path: "/reset-password",
		errorMessage: message,
	});
};

exports.postReset = (req, res, next) => {
	const email = req.body.email;
	crypto.randomBytes(32, (err, buff) => {
		if (err) {
			console.log(err);
			return res.redirect("/reset-password");
		}
		const token = buff.toString("hex");
		User.findOne({ email })
			.then(user => {
				if (!user) {
					req.flash("error", "Email not found with any associated account.");
					return res.redirect("/reset-password");
				}
				user.resetToken = token;
				user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
				return user.save().then(() => {
					res.redirect("/");
					const html = `
                    <p>Your requested for password reset</p>
                    <p>Please <a href="http://localhost:4000/reset-password/${token}">click here</a> to reset your password</p>
                    `;
					sendMail(email, "Password Reset!", html);
				});
			})
			.catch(err => console.log(err));
	});
};

exports.getNewPassword = (req, res, next) => {
	const token = req.params.token;
	User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
		.then(user => {
			let message = req.flash("error");
			if (message.length > 0) {
				message = message[0];
			} else {
				message = null;
			}
			res.render("auth/new-password", {
				pageTitle: "New Password",
				path: "/new-password",
				errorMessage: message,
				userId: user._id.toString(),
				passwordToken: token,
			});
		})
		.catch(err => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
	const newPassword = req.body.password;
	const passwordToken = req.body.passwordToken;
	const userId = req.body.userId;
	let resetUser;

	User.findOne({
		resetToken: passwordToken,
		resetTokenExpiration: { $gt: Date.now() },
		_id: userId,
	})
		.then(user => {
			resetUser = user;
			return bcrypt.hash(newPassword, 12);
		})
		.then(hashedPassword => {
			resetUser.password = hashedPassword;
			resetUser.resetToken = undefined;
			resetUser.resetTokenExpiration = undefined;
			return resetUser.save();
		})
		.then(() => {
			res.redirect("/login");
		})
		.catch(err => console.log(err));
};
