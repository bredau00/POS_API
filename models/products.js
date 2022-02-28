const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Acdw0IWPRMwkDOFu78_Lf-ltHq2TsFhV8A&usqp=CAU",
  },
  price: {
    type: Number,
    required: true
  },
  created_by: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model("Product", productSchema);
