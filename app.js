const express = require("express");
const router = require("./src/routes/api");
const app = express();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const cors = require("cors");
const xss = require("xss");
const mongoose = require("mongoose");

// ✅ Trust proxy (to fix express-rate-limit X-Forwarded-For issue)
app.set("trust proxy", 1);

// ----------- Security Middlewares -----------
app.use(cors());
app.use(helmet());
app.use(hpp());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ----------- XSS Protection -----------
app.use((req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === "string") obj[key] = xss(obj[key]);
      else if (typeof obj[key] === "object" && obj[key] !== null) sanitize(obj[key]);
    }
  };
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);
  next();
});

// ----------- NoSQL Injection Protection -----------
app.use((req, res, next) => {
  const sanitizeKeys = (obj) => {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) delete obj[key];
      else if (typeof obj[key] === "object" && obj[key] !== null) sanitizeKeys(obj[key]);
    }
  };
  if (req.body) sanitizeKeys(req.body);
  if (req.params) sanitizeKeys(req.params);
  next();
});

// ----------- Rate Limiting -----------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ----------- MongoDB Connection -----------
mongoose.connect(
  "mongodb+srv://arfanhosenovi:arfanhosenovi201002487@cluster0.a4mj3kc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { autoIndex: true }
)
.then(() => console.log("Database Connection Success"))
.catch((error) => console.log("Database Connection Failed:", error));

// ----------- Routing -----------
app.use("/api/v1", router);

// ----------- 404 Handler -----------
app.use((req, res) => res.status(404).json({ status: "fail", data: "Not Found" }));

module.exports = app;
