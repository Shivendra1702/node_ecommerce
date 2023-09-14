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
    8;
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

const adminGetAllProducts = async function (req, res, next) {
  try {
  } catch (error) {}
};

const getProduct = async function (req, res, next) {
  try {
  } catch (error) {}
};

module.exports = {
  addProduct,
  getProducts,
  adminGetAllProducts,
  getProduct,
};
