const express = require("express");
const router = express.Router();

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

router.get("/login", getLogin);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignup);

router.post("/signup", postSignup);

router.get("/reset-password", getReset);

router.post("/reset-password", postReset);

router.get("/reset-password/:token", getNewPassword);

router.post("/new-password", postNewPassword);

module.exports = router;
