const express = require("express");
const router = express.Router();
const adminData = require("./addUser");

router.get("/", (req, res, next) => {
	const users = adminData.users;
	res.render("users", {
		users,
		pageTitle: "My users",
		path: "/",
		hasProducts: users.length > 0,
		activeShop: true,
	});
});

module.exports = router;
