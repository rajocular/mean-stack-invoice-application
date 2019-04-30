const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hsncode: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  cost_price: {
    type: Number,
    required: true
  },
  sale_price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
