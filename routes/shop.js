const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/", shopController.getShop);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);

router.post("/cart", isAuth, shopController.addCart);

router.post("/cart-delete-item", isAuth, shopController.postDeleteCartItem);

router.post("/create-order", shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
