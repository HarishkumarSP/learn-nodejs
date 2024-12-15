const express = require("express");
const router = express.Router();
const adminData = require("./admin");

router.get("/", (req, res, next) => {
	console.log(adminData.products);
	const products = adminData.products;
	res.render("shop", {
		products,
		pageTitle: "My shop",
		path: "/",
		hasProducts: products.length > 0,
		activeShop: true,
	});
});

module.exports = router;
