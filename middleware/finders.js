const User = require("../models/users");
const Product = require("../models/products");

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);

    if (!user) res.status(404).json({ message: "Could not find user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.user = user;
  next();
}

async function getProduct(req, res, next) {
  let product;
  try {
    product = await product.findById(req.params.id);
    if (!product) res.status(404).json({ message: "Could not find post" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  res.product = product;
  next();
}

module.exports = { getUser, getProduct };
