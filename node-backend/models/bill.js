const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  tax_amount: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
