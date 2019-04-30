const mongoose = require('mongoose');

const invoiceSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  bills: [{
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
  }],
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
  }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
