const express = require("express");
const router = require("./src/routes/api");
const app = new express();
const bodyParser = require("body-parser");

// Security Middleware LIB Import
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Database LIB Import
const mongoose = require("mongoose");

// Security Middleware Implement
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(bodyParser.json());

// Request Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
});
app.use(limiter);

// MongoDB Database Connection
let URL = "mongodb://localhost:27017/todo";
let OPTION = { autoIndex: true };

mongoose.connect(URL, OPTION)
    .then(() => console.log(" Database Connection Success"))
    .catch((error) => console.log(" Database Connection Failed:", error));

// Routing
app.use("/api/v1", router);

// Undefined Route
app.use("*", (req, res) => {
    res.status(404).json({ status: "fail", data: "Not Found" });
});

module.exports = app;
