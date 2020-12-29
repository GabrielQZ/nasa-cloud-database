const mongoose = require('mongoose');

const Media = mongoose.model('media', new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  year: {
    type: Number,
    required: true
  },
  
  month: {
    type: Number,
    required: true
  },

  day: {
    type: Number,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  media_type: {
    type: String,
    enum: ["video","image"],
    default: "image",
  },

  likes: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "users",
    default: []
  }

}))

module.exports = Media;