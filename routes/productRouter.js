require("dotenv").config;

const express = require("express");
const Product = require("../models/products");
const auth = require("../middleware/auth");
const { getPost, getProduct } = require("../middleware/finders");

const router = express.Router();

// GET all products
router.get("/", auth, async (req, res) => {
try {
    const posts = await Product.find();
    res.status(201).send(posts);
} catch (error) {
    res.status(500).send({ message: error.message });
}
});

// GET one product
router.get("/:id", [auth, getProduct], (req, res, next) => {
res.send(res.post);
});

// CREATE a product
router.post("/", auth, async (req, res, next) => {
const { title, body, img } = req.body;

let post;

img
    ? (post = new Post({
        title,
        category,
        discription: req.user._id,
        img,
        price,
    }))
    : (post = new Post({
        title,
        category,
        user: req.user._id,
    }));

try {
    const newPost = await post.save();
    res.status(201).json(newPost);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// UPDATE a product
router.put("/:id", [auth, getProduct], async (req, res, next) => {
if (req.user._id !== res.post.author)
    res
    .status(400)
    .json({ message: "You do not have the permission to update this product" });
const { title, body, img } = req.body;
if (title) res.post.title = title;
if (category) res.post.category = category;
if (img) res.post.img = img;

try {
    const updatedPost = await res.post.save();
    res.status(201).send(updatedPost);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// DELETE a product
router.delete("/:id", [auth, getProduct], async (req, res, next) => {
if (req.user._id !== res.post.author)
    res
    .status(400)
    .json({ message: "You do not have the permission to delete this product" });
try {
    await res.post.remove();
    res.json({ message: "Deleted product" });
} catch (error) {
    res.status(500).json({ message: error.message });
}
});

module.exports = router;