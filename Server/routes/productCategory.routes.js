const express = require("express");
const router = express.Router();

const productCategoryController = require("../controllers/productCategory.controller");

router.post("/", productCategoryController.createProductCategory);
router.get("/", productCategoryController.findAllProductCategories);
router.get("/:id", productCategoryController.findProductCategory);
router.delete("/:id", productCategoryController.deleteProductCategory);
router.put("/:id", productCategoryController.updateProductCategory);

module.exports = router;
