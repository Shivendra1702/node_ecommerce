const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/user");

const {
  addProduct,
  getProducts,
  getProduct,
  addReview,
  deleteReview,
  adminGetAllProducts,
  adminUpdateSingleProduct,
  adminDeleteSingleProduct,
} = require("../controllers/productController");

//user routes
router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct);
router
  .route("/product/review/:id")
  .put(isLoggedIn, addReview)
  .delete(isLoggedIn, deleteReview);

//admin routes
router
  .route("/admin/product/add")
  .post(isLoggedIn, customRole("admin"), addProduct);

router
  .route("/admin/products")
  .get(isLoggedIn, customRole("admin"), adminGetAllProducts);

router
  .route("/admin/product/:id")
  .put(isLoggedIn, customRole("admin"), adminUpdateSingleProduct)
  .delete(isLoggedIn, customRole("admin"), adminDeleteSingleProduct);

module.exports = router;
