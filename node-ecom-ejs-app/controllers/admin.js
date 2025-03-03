const { validationResult } = require("express-validator");
const Product = require("../models/product");
const { deleteFile } = require("../utils/file");

exports.getProducts = (req, res, next) => {
	Product.find({ userId: req.user._id })
		// .select("title price -_id")
		// .populate("userId")
		.then((products) => {
			res.render("admin/products", {
				prods: products,
				pageTitle: "Admin Products",
				path: "/admin/products",
			});
		})
		.catch((err) => {
			console.log(err);
		});
};

exports.getAddProduct = (req, res, next) => {
	let message = req.flash("error");
	if (message.length > 0) {
		message = message[0];
	} else {
		message = null;
	}
	res.render("admin/add-product", {
		pageTitle: "Add Product",
		path: "/admin/add-product",
		formsCSS: true,
		productCSS: true,
		activeAddProduct: true,
		editing: false,
		errorMessage: message,
		oldInput: {
			title: "",
			imageUrl: "",
			price: "",
			description: "",
		},
		validationErrors: [],
	});
};

exports.postAddProduct = (req, res, next) => {
	const title = req.body.title;
	const image = req.file;
	const price = req.body.price;
	const description = req.body.description;
	const userId = req.user;
	if (!image) {
		return res.status(422).render("admin/add-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			errorMessage: "Attached file is not an image",
			oldInput: {
				title,
				price,
				description,
			},
			validationErrors: [],
		});
	}
	const imageUrl = image.path;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render("admin/add-product", {
			pageTitle: "Add Product",
			path: "/admin/add-product",
			errorMessage: errors.array()[0].msg,
			oldInput: {
				title,
				imageUrl,
				price,
				description,
			},
			validationErrors: errors.array(),
		});
	}
	const product = new Product({
		title,
		price,
		description,
		imageUrl,
		userId,
	});
	product
		.save()
		.then(() => {
			res.redirect("/admin/products");
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect("/");
	}
	const prodId = req.params.productId;
	Product.findById(prodId)
		// Product.findByPk(prodId)
		.then((product) => {
			if (!product) {
				return res.redirect("/");
			}
			res.render("admin/edit-product", {
				pageTitle: "Edit Product",
				path: "/admin/edit-product",
				editing: editMode,
				product,
				errorMessage: null,
				validationErrors: [],
			});
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const prodId = req.body.productId;
	const updatedTitle = req.body.title;
	const updatedPrice = req.body.price;
	const image = req.file;
	const updatedDesc = req.body.description;

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).render("admin/edit-product", {
			pageTitle: "Edit Product",
			path: "/admin/edit-product",
			validationErrors: errors.array(),
			errorMessage: errors.array()[0].msg,
			product: {
				title: updatedTitle,
				price: updatedPrice,
				description: updatedDesc,
				_id: prodId,
			},
		});
	}

	Product.findById(prodId)
		.then((product) => {
			if (product.userId.toString() !== req.user._id.toString()) {
				return res.redirect("/");
			}
			product.title = updatedTitle;
			product.price = updatedPrice;
			product.description = updatedDesc;
			if (image) {
				deleteFile(product.imageUrl);
				product.imageUrl = image.path;
			}
			return product.save().then(() => res.redirect("/admin/products"));
		})
		.catch((err) => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.deleteProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then((product) => {
			if (!product) {
				return next(new Error("Product not found"));
			}
			deleteFile(product.imageUrl);
			return Product.deleteOne({ _id: prodId, userId: req.user._id });
		})
		.then(() => res.status(200).json({ message: "Success" }))
		.catch((err) => {
			res.status(500).json({ message: "Delete product failed" });
		});
};
