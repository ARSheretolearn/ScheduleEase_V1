// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleid: { type: String, unique: true },
  name: String,
  email: { type: String, unique: true },
  role: String,
  createdat: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
