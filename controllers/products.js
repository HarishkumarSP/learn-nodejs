const Product = require("../models/product");

const getProduct = (req, res, next) => {
	res.render("add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		activeAddProduct: true,
		productCss: true,
	});
};
const addProduct = (req, res, next) => {
	const product = new Product(req.body.title);
	product.save();
	res.redirect("/");
};

const showProducts = (req, res, next) => {
	Product.fetchAll(products => {
		res.render("shop", {
			products,
			pageTitle: "My shop",
			path: "/",
			hasProducts: products.length > 0,
			activeShop: true,
		});
	});
};

module.exports = {
	getProduct,
	addProduct,
	showProducts,
};
