const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const sendStripeKey = async function (req, res, next) {
  return res.status(200).json({
    success: true,
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
};

const captureStripePayment = async function (req, res, next) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "inr",
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendRazorpayKey = async function (req, res, next) {
  return res.status(200).json({
    success: true,
    razorpayApiKey: process.env.RAZORPAY_API_KEY,
  });
};

const captureRazorpayPayment = async function (req, res, next) {
  try {
    var instance = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const myOrder = await instance.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(20).toString("hex"),
    });

    return res.status(200).json({
      success: true,
      amount,
      order: myOrder,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendStripeKey,
  captureStripePayment,
  sendRazorpayKey,
  captureRazorpayPayment,
};
