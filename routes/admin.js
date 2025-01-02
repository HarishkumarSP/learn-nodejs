const express = require("express");
const { getProduct, addProduct } = require("../controllers/products");
const router = express.Router();

router.get("/add-product", getProduct);

router.post("/add-product", addProduct);

module.exports = router;
