require("dotenv").config;

const express = require("express");
const User = require("../models/users");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser } = require("../middleware/finders");
const { getProduct } = require("../middleware/finders");
const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
    try {
    const users = await User.find();
    res.json(users);
    } catch (error) {
    res.status(500).send({ message: error.message });
    }
});

// GET one user
router.get("/:id", getUser, (req, res, next) => {
    res.send(res.user);
});

// LOGIN user with email + password
router.patch("/", async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) res.status(404).json({ message: "Could not find user" });
    if (await bcrypt.compare(password, user.password)) {
    try {
        const access_token = jwt.sign(
        JSON.stringify(user),
        process.env.MONGO_PASS
        );
        res.status(201).json({ jwt: access_token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    } else {
    res
        .status(400)
        .json({ message: "Email and password combination do not match" });
    }
});

// REGISTER a user
router.post("/", async (req, res, next) => {
    const { name, email, contact, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
    name,
    email,
    contact,
    password: hashedPassword,
    });

    try {
    const newUser = await user.save();

    try {
        const access_token = jwt.sign(
        JSON.stringify(newUser),
        process.env.MONGO_PASS
        );
        res.status(201).json({ jwt: access_token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});

// UPDATE a user
router.put("/:id", getUser, async (req, res, next) => {
    const { name, email, contact, password } = req.body;
    if (name) res.user.name = name;
    if (email) res.user.email = email;
    if (contact) res.user.contact = contact;
    if (password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    res.user.password = hashedPassword;
    }

    try {
    const updatedUser = await res.user.save();
    res.status(201).send(updatedUser);
    } catch (error) {
    res.status(400).json({ message: error.message });
    }
});

  // DELETE a user
router.delete("/:id", getUser, async (req, res, next) => {
    try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
});

// CART FUNCTIONALITY

// Get cart
router.get('/:id/cart', [auth, getUser], (req, res, next)=>{
    try {
        res.json(req.user.cart);
        } catch (error) {
        res.status(500).send({ message: error.message });
        }
})

// ADD PRODUCT TO USER CART
router.post(
    "/:id/cart",
    [auth, getProduct],
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
  
      let product_id = res.product._id;
      let title = res.product.title;
      let category = res.product.category;
      let img = res.product.img;
      let price = res.product.price;
      let quantity = req.body.quantity;
      let created_by = req.user._id;
  
      try {
        user.cart.push({
          product_id,
          title,
          category,
          price,
          img,
          quantity,
          created_by,
        });
        const updatedUser = await user.save();
        res.status(201).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );
  
  // UPDATE PRODUCT IN USER CART
  router.put(
    "/:id/cart",
    [auth, getProduct],
    async (req, res, next) => {
      const user = await User.findById(req.user._id);
      const inCart = user.cart.some((prod) => prod.product_id == req.params.id);
      console.log(inCart);
  
      if (inCart) {
        try {
          const product = user.cart.find(
            (prod) => prod.product_id == req.params.id
          );
          product.quantity = req.body.quantity;
          user.cart.quantity = product.quantity;
          user.markModified("cart");
          const updatedUser = await user.save();
          console.log(updatedUser);
          res.status(201).json(updatedUser.cart);
        } catch (error) {
          res.status(500).json(console.log(error));
        }
      }
    }
  );
  



// Delete from Cart
router.delete('/:id/cart', [auth, getUser], async (req, res, next)=>{
    try {
        await res.user.cart.remove()
        res.json({ message: "Removed product" });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
})

module.exports = router;