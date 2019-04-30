const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  area:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area',
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  contact: {
    type: Number,
    required: false
  },
  pincode: {
    type: String,
    required: false
  },
  gstnumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
  }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
