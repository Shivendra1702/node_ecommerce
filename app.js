require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();

//import routes
const homeRouter = require("./routes/homeRoute");

//regular middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//morgan middleware
app.use(morgan("tiny"));

//Router middleware
app.use("/api/v1", homeRouter);

module.exports = app;
