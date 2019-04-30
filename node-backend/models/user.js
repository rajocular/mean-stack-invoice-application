const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  firstname:{
    type: String,
    required: true,
    trim: true
  },
  lastname:{
    type: String,
    required: true,
    trim: true
  },
  address:{
    type: String,
    required: true,
    trim: true
  },
  city:{
    type: String,
    required: true,
    trim: true
  },
  state:{
    type: String,
    required: true,
    trim: true
  },
  country:{
    type: String,
    required: true,
    trim: true
  },
  pincode:{
    type: String,
    required: true,
    trim: true
  },
  contact:{
    type: Number,
    required: true
  },
  organization:{
    type: String,
    required: true,
    trim: true
  },
  gstnumber:{
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismydatabase');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error('Unable to login')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login')
  }

  return user
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
});

const User = mongoose.model('User', userSchema);

module.exports = User;
