require("dotenv").config;

const express = require("express");
const Product = require("../models/products");
const auth = require("../middleware/auth");
const { getProduct } = require("../middleware/finders");

const router = express.Router();

// GET all products
router.get("/", auth, async (req, res) => {
try {
    const products = await Product.find();
    res.status(201).send(products);
} catch (error) {
    res.status(500).send({ message: error.message });
}
});

// GET one product
router.get("/:id", [auth, getProduct], (req, res, next) => {
res.send(res.product);
});

// CREATE a product
router.post("/", auth, async (req, res, next) => {
const { title, category, description, img, price, created_by } = req.body;
console.log(title, category, description, img, price,)

let product;

img
    ? (product = new Product({
        title,
        category,
        description,
        img,
        price,
        created_by: req.user._id,
    }))
    : (product = new Product({
        title,
        category,
        description,
        img,
        price,
        created_by: req.user._id,
    }));

try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// UPDATE a product
router.put("/:id", [auth, getProduct], async (req, res, next) => {
if (req.user._id !== res.product.created_by)
    res
    .status(400)
    .json({ message: "You do not have the permission to update this product" });
    
const { title, category, description, img, price } = req.body;
if (title) res.product.title = title;
if (category) res.product.category = category;
if (description) res.product.description = description;
if (img) res.product.img = img;
if (price) res.product.price = price;

try {
    const updatedProduct = await res.product.save();
    res.status(201).send(updatedProduct);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// DELETE a product
router.delete("/:id", [auth, getProduct], async (req, res, next) => {
if (req.user._id !== res.product.created_by)
    res
    .status(400)
    .json({ message: "You do not have the permission to delete this product" });
try {
    await res.product.remove();
    res.json({ message: "Deleted product" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;