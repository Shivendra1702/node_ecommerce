const Product = require("../models/product");
const WhereClause = require("../utils/whereClause");
const cloudinary = require("cloudinary").v2;

const addProduct = async function (req, res, next) {
  try {
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: `Please upload images`,
      });
    }

    const imageArray = [];

    if (req.files) {
      for (let i = 0; i < req.files.photos.length; i++) {
        const result = await cloudinary.uploader.upload(
          req.files.photos[i].tempFilePath,
          {
            folder: "products",
          }
        );
        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    req.body.photos = imageArray;
    req.body.user = req.user._id;

    const product = await Product.create(req.body);

    product.stock = product.stock + 1;
    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error adding Product : ${error}`,
    });
  }
};

const getProducts = async function (req, res, next) {
  try {
    const resultPerPage = 6;
    const totalProducts = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query)
      .search()
      .filter();

    let products = await productsObj.base;

    const filteredProductsCount = products.length;
    // const filteredProductsCount=products.length;

    productsObj.pager(resultPerPage);
    products = await productsObj.base.clone();

    return res.status(200).json({
      success: true,
      products,
      totalProducts,
      filteredProductsCount,
    });
    // products = new WhereClause(products,req.query);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error Getting Products :${error}`,
    });
  }
};

const getProduct = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({
        success: false,
        error: `Product not found !!`,
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Getting Product !!`,
    });
  }
};

const addReview = async function (req, res, next) {
  try {
    const productId = req.params.id;
    const { rating, comment } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = Number(rating);
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numberOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Adding Review !!`,
    });
  }
};

const deleteReview = async function (req, res, next) {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    const reviews = product.reviews.filter((review) => {
      return review.user.toString() !== req.user._id.toString();
    });

    product.reviews = reviews;
    product.numberOfReviews = reviews.length;
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Deleting Review !!`,
    });
  }
};

const adminGetAllProducts = async function (req, res, next) {
  try {
    const products = await Product.find({});
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Getting all Products !!`,
    });
  }
};

const adminUpdateSingleProduct = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({
        success: false,
        error: `Product not found !!`,
      });
    }

    const imageArray = [];

    if (req.files) {
      for (let i = 0; i < product.photos.length; i++) {
        await cloudinary.uploader.destroy(product.photos[i].id);
      }

      for (let i = 0; i < req.files.photos.length; i++) {
        const result = await cloudinary.uploader.upload(
          req.files.photos[i].tempFilePath,
          {
            folder: "products",
          }
        );
        imageArray.push({
          id: result.public_id,
          secure_url: result.secure_url,
        });
      }

      req.body.photos = imageArray;
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Updating Product !!`,
    });
  }
};

const adminDeleteSingleProduct = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(401).json({
        success: false,
        error: `Product not found !!`,
      });
    }
    for (let i = 0; i < product.photos.length; i++) {
      await cloudinary.uploader.destroy(product.photos[i].id);
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: `Error Deleting Product !!`,
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  addReview,
  deleteReview,
  adminGetAllProducts,
  adminUpdateSingleProduct,
  adminDeleteSingleProduct,
};
