const mongoose = require('mongoose');

const User = mongoose.model('user', new mongoose.Schema({

  username: {
    type: String,
    minlength: 3,
    maxlength: 20,
    required: true,
  },
  email: {
    type: String,
    minlength: 6,
    maxlength: 64,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 100,
    required: true,
  },
  liked: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "media",
    default: []
  },
  validateCode: String,
  validated: {
    type: Boolean,
    default: false,
  },
}))

module.exports = User;