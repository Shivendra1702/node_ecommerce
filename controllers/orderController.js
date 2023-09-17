const Order = require("../models/order");
const Product = require("../models/product");

const createOrder = async function (req, res, next) {
  try {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
    } = req.body;

    const order = await Order.create({
      shippingInfo,
      user: req.user._id,
      orderItems,
      paymentInfo,
      taxAmount,
      shippingAmount,
      totalAmount,
    });

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getOneOrder = async function (req, res, next) {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order not found with id ${orderId}`,
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {}
};

const getLoggedInOrders = async function (req, res, next) {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: `No orders found `,
      });
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Problem fetching all Orders `,
    });
  }
};

const adminGetAllOrders = async function (req, res, next) {
  try {
    const allOrders = await Order.find().populate("user", "name email");
    if (!allOrders) {
      return res.status(404).json({
        success: false,
        message: `No orders found `,
      });
    }
    return res.status(200).json({
      success: true,
      allOrders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Problem fetching all Orders `,
    });
  }
};

const adminUpdateOrder = async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: `Order has already been delivered`,
      });
    }
    order.orderStatus = req.body.orderStatus;
    if (req.body.orderStatus === "Delivered") {
      order.deliveredAt = Date.now();
    }

    order.orderItems.forEach(async (prod) => {
      await updateProductStock(prod.product, prod.quantity);
    });

    await order.save();
    return res.status(200).json({
      success: true,
      message: `Order Status Updated Successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Problem Updating Order Status !`,
    });
  }
};

const adminDeleteOrder = async function (req, res, next) {
  try {
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      error:`Error Deleting Order`
    })
  }
};

module.exports = {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  adminGetAllOrders,
  adminUpdateOrder,
  adminDeleteOrder
};

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}
