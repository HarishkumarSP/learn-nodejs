const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// .select("title price -_id")
		// .populate("userId")
		.then(products => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getAddProduct = (req, res, next) => {
	res.render("admin/add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
		editing: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const imageUrl = req.body.imageUrl;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.user;
	const product = new Product({ title, price, description, imageUrl, userId });
	product
		.save()
		.then(() => {
			res.redirect("/admin/products");
		})
		.catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		// Product.findByPk(prodId)
		.then(product => {
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product,
			});
		})
		.catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const updatedImageUrl = req.body.imageUrl;
	const updatedDesc = req.body.description;
	Product.findById(prodId)
		.then(product => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			product.imageUrl = updatedImageUrl;
			return product.save().then(() => res.redirect("/admin/products"));
		})
		.catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
	const prodId = req.body.productId;
	Product.deleteOne({ userId: req.user._id, _id: prodId })
		.then(() => res.redirect("/admin/products"))
		.catch(err => console.log(err));
};
