const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const router = express.Router();
const { check, body } = require("express-validator");

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post(
	"/add-product",
	isAuth,
	[
		body("title").isLength({ min: 3 }).trim().withMessage("Title must be atleast 3 characters long"),
		body("price").isFloat().withMessage("Please enter a valid price"),
		body("description")
			.trim()
			.isLength({ min: 5, max: 400 })
			.withMessage("Description must be between 5 characters to 400 characters length"),
	],
	adminController.postAddProduct
);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
	"/edit-product",
	[
		body("title").isLength({ min: 3 }).trim().withMessage("Title must be atleast 3 characters long"),
		body("price").isFloat().withMessage("Please enter a valid price"),
		body("description")
			.trim()
			.isLength({ min: 5, max: 400 })
			.withMessage("Description must be between 5 characters to 400 characters length"),
	],
	adminController.postEditProduct
);

router.delete("/product/:productId", adminController.deleteProduct);

module.exports = router;
