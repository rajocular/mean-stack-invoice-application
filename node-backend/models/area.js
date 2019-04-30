const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
