const express = require("express");
const { showProducts } = require("../controllers/products");
const router = express.Router();

router.get("/", showProducts);

module.exports = router;
