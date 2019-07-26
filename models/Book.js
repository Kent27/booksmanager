const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: String,
    required: true
  },
  publishedOn: {
    type: Number,
    required: true
  },
  numberOfPages: {
    type: Number,
    required: true
  }
});

module.exports = Book = mongoose.model("book", BookSchema);
