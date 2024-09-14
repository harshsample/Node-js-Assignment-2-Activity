const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/product");
const Category = require("../models/category");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.render("index", { products });
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET form to add product
router.get("/add", async (req, res) => {
  const categories = await Category.find();
  res.render("add-product", { categories });
});

// POST new product
router.post("/add", upload.array("images", 5), async (req, res) => {
  const images = req.files.map((file) => "/uploads/" + file.filename);
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    images: images,
  });
  try {
    await product.save();
    res.redirect("/products");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET form to edit product
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const categories = await Category.find();
    res.render("edit-product", { product, categories });
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST update product
router.post("/edit/:id", upload.array("images", 5), async (req, res) => {
  const images =
    req.files.length > 0
      ? req.files.map((file) => "/uploads/" + file.filename)
      : undefined;
  const updateData = {
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
  };
  if (images) updateData.images = images;

  try {
    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET delete product
router.get("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
