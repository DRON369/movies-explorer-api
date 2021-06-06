const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  //! Validation needed
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

}, { versionKey: false });

const User = mongoose.model('User', userSchema);
User.createIndexes();
module.exports = User;
