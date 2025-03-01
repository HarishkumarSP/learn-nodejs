const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const {
	getLogin,
	postLogin,
	postLogout,
	getSignup,
	postSignup,
	getReset,
	postReset,
	getNewPassword,
	postNewPassword,
} = require("../controllers/auth");
const User = require("../models/user");

router.get("/login", getLogin);

router.post(
	"/login",
	[
		body("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value) => {
				return User.findOne({ email: value }).then((user) => {
					if (!user) {
						return Promise.reject("Invalid email or password");
					}
				});
			}),
		body("password", "password has to be valid").isLength({ min: 5 }).isAlphanumeric(),
	],
	postLogin
);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post(
	"/signup",
	[
		check("email")
			.isEmail()
			.withMessage("Please enter a valid email")
			.custom((value, { req }) => {
				return User.findOne({ email: value }).then((userData) => {
					if (userData) {
						return Promise.reject("Email already exists");
					}
				});
			})
			.normalizeEmail(), // sanitize input
		body("password", "Please enter a password with only numbers and text and atleast 5 characters")
			.isLength({ min: 5 })
			.isAlphanumeric()
			.trim(), // sanitize input
		body("confirmPassword")
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("Password have to match");
				}
				return true;
			}),
	],
	postSignup
);

router.get("/reset-password", getReset);

router.post("/reset-password", postReset);

router.get("/reset-password/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
