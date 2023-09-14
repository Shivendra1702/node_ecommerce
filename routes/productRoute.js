const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

const { addProduct, getProducts,getProduct,adminGetAllProducts } = require("../controllers/productController");

//user routes
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);


//admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .post(isLoggedIn, customRole("admin"), adminGetAllProducts);  

module.exports = router;
