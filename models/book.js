// models/book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  price: Number,
  availability: Boolean,
  ratings: Number,
  // Add other book fields as needed
});

module.exports = mongoose.model('Book', bookSchema);
