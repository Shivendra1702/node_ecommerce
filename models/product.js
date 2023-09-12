const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product Name is required !"],
    trim: true,
    maxlength: [120, "Product Name cannot exceed 120 characters !"],
  },

  price: {
    type: Number,
    required: [true, "Product price is required !"],
    maxlength: [6, "Product price should not be more than 6 digits !"],
  },

  description: {
    type: String,
    required: [true, "Product description is required !"],
  },

  photos: [
    {
      id: {
        type: String,
        required: [true, "Photo id is required !"],
      },
      secure_url: {
        type: String,
        required: [true, "Photo url is required !"],
      },
    },
  ],

  category: {
    type: String,
    required: [true, "Product category is required !"],
    enum: {
      values: ["shortsleeves", "longsleeves", "sweatshirts", "hoodies"],
      message: ["Please select a valid category !"],
    },
  },

  brand: {
    type: String,
    required: [true, "Product brand is required !"],
  },

  stock: {
    type: Number,
    required: [true, "Product stock is required !"],
    default: 0,
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numberOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
      },
      comment: {
        type: String,
        required: [true, "Comment is required !"],
      },
      rating: {
        type: Number,
        required: [true, "Rating is required !"],
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
