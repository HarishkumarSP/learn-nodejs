const { createWriteStream } = require("fs");
const Order = require("../models/order");
const Product = require("../models/product");
const path = require("path");
const PDFDocument = require("pdfkit");

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getProduct = (req, res, next) => {
	const prodId = req.params.productId;
	Product.findById(prodId)
		.then(product => {
			res.render("shop/product-detail", {
				product: product,
				pageTitle: product.title,
				path: "/products",
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getShop = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render("shop/index", {
				prods: products,
				pageTitle: "Shop",
				path: "/",
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getCart = (req, res, next) => {
	req.user
		.populate("cart.items.productId") // populate only the data which we need to expand and use
		.then(user => {
			const products = user.cart.items;
			console.log({ products });
			res.render("shop/cart", {
				path: "/cart",
				pageTitle: "Your Cart",
				products,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postDeleteCartItem = (req, res, next) => {
	const prodId = req.body.productId;
	req.user
		.deleteCartItem(prodId)
		.then(() => res.redirect("/cart"))
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.addCart = (req, res, next) => {
	const prodId = req.body.productId;
	Product.findById(prodId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			console.log(result);
			res.redirect("/cart");
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ "user.userId": req.user._id })
		.then(orders => {
			res.render("shop/orders", {
				path: "/orders",
				pageTitle: "Your Orders",
				orders: orders,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.postOrder = (req, res, next) => {
	req.user
		.populate("cart.items.productId") // populate only the data which we need to expand and use
		.then(user => {
			const products = user.cart.items.map(item => {
				return {
					product: { ...item.productId._doc },
					quantity: item.quantity,
				};
			});
			const order = new Order({
				user: {
					userId: req.user,
					email: req.user.email,
				},
				products,
			});
			return order.save();
		})
		.then(() => {
			return req.user.clearCart();
		})
		.then(() => {
			res.redirect("/orders");
		})
		.catch(err => {
			const error = new Error(err);
			error.httpStatusCode = 500;
			return next(error);
		});
};

exports.getInvoice = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.then(order => {
			if (!order) {
				return next(new Error("No order found"));
			}
			if (order.user.userId.toString() !== req.user._id.toString()) {
				return next(new Error("Unauthorized"));
			}
			const invoiceName = `invoice-${orderId}.pdf`;
			const invoicePath = path.join("data", "invoices", invoiceName);
			// 	Generate pdf using pdfkit and sends it as the response.
			//  The code creates a new PDFDocument instance, sets the appropriate response headers,
			// and pipes the PDF document to both the file system and the HTTP response.
			// It then adds some sample text to the PDF document and ends the document.
			const pdfDoc = new PDFDocument();
			res.setHeader("Content-Type", "application/pdf");
			res.setHeader(
				"Content-Disposistion",
				'inline; filename="' + invoiceName + '"'
			);
			pdfDoc.pipe(createWriteStream(invoicePath));
			pdfDoc.pipe(res);
			pdfDoc.fontSize(25).text("Invoice", 100, 50, { underline: true });
			pdfDoc.text("-----------------------");
			pdfDoc.text(`Order Id: ${order._id}`);
			let totalPrice = 0;
			order.products.forEach(prod => {
				totalPrice += prod.quantity * prod.product.price;
				pdfDoc
					.fontSize(15)
					.text(`${prod.product.title} - ${prod.quantity} x $${prod.product.price}`);
			});
			pdfDoc.text("-----------------------");
			pdfDoc.fontSize(20).text(`Total price - $${totalPrice}`);
			pdfDoc.end();
			// For reference of how we read file and generates an file from local with two ways
			// For smaller files we can use this
			// readFile(invoicePath, (err, data) => {
			// 	if (err) {
			// 		console.log({ err });
			// 		return next(err);
			// 	}
			// 	res.setHeader("Content-Type", "application/pdf");
			// 	res.setHeader(
			// 		"Content-Disposistion",
			// 		'inline; filename="' + invoiceName + '"'
			// 	);
			// 	res.send(data);
			// });

			// This is for reading bigger files
			// const file = createReadStream(invoicePath);
			// res.setHeader("Content-Type", "application/pdf");
			// res.setHeader(
			// 	"Content-Disposistion",
			// 	'inline; filename="' + invoiceName + '"'
			// );
			// file.pipe(res);
		})
		.catch(err => next(err));
};
