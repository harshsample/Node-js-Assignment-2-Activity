const express = require("express");
const router = express.Router();
const Category = require("../models/category");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.render("categories", { categories });
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET form to add category
router.get("/add", (req, res) => {
  res.render("add-category");
});

// POST new category
router.post("/add", async (req, res) => {
  const category = new Category({ name: req.body.name });
  try {
    await category.save();
    res.redirect("/categories");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET form to edit category
router.get("/edit/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render("edit-category", { category });
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST update category
router.post("/edit/:id", async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.redirect("/categories");
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET delete category
router.get("/delete/:id", async (req, res) => {
  try {
    await Category.findByIdAndRemove(req.params.id);
    res.redirect("/categories");
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
