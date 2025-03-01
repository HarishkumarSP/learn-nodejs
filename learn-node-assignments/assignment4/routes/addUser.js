const express = require("express");
const path = require("path");
const router = express.Router();

const users = [];

router.get("/add-users", (req, res, next) => {
	res.render("add-users", {
		pageTitle: "Add Users",
		path: "/add-users",
		activeAddProduct: true,
		productCss: true,
	});
});

router.post("/add-users", (req, res, next) => {
	users.push({ user: req.body.user });
	res.redirect("/");
});

module.exports = {
	router,
	users,
};
