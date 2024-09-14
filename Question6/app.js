const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const categoriesRoute = require("./routes/categories");
const productsRoute = require("./routes/products");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/crudApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/categories", categoriesRoute);
app.use("/products", productsRoute);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
