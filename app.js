require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();

//import routes
const homeRouter = require("./routes/homeRoute");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");
const paymentRouter = require("./routes/paymentRoute");
const orderRouter = require("./routes/orderRoute");

//temp test
app.set("view engine", "ejs");

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//morgan middleware
app.use(morgan("tiny"));

//Router middleware
app.use("/api/v1", homeRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", orderRouter);

// temp test
app.get("/signuptest", (req, res) => {
  res.render("signuptest");
});

module.exports = app;
