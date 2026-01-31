const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const { validateProduct } = require("../validation/product.validation");

router.post("/", validateProduct, productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/names", productController.getAllProductsNames);
router.get("/category/:id", productController.getAllProductsByCategoryByPage);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
