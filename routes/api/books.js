const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isEmpty = require("../../validation/is-empty");

// Book model
const Book = require("../../models/Book");

// Validation
const validateBookInput = require("../../validation/book");

// Remove deprecation warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);

// @route   GET api/books/test
// @desc    Tests books route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Books Works" }));

// @route   GET api/books
// @desc    Get books
// @access  Private
router.get("/", (req, res) => {
  Book.find()
    .then(books => res.json(books))
    .catch(err => res.status(404).json({ error: "No Books found" }));
});

// @route   GET api/books/:id
// @desc    Get book by id
// @access  Private
router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .then(book => res.json(book))
    .catch(err =>
      res.status(404).json({ error: "No book found with that ID" })
    );
});

// @route   POST api/books
// @desc    Create book
// @access  Private
router.post("/", (req, res) => {
  const { errors, isValid } = validateBookInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  // Default values
  req.body.publishedOn = !isEmpty(req.body.publishedOn)
    ? req.body.publishedOn
    : 1970;
  req.body.numberOfPages = !isEmpty(req.body.numberOfPages)
    ? req.body.numberOfPages
    : 0;

  const newBook = new Book({
    title: req.body.title,
    author: req.body.author,
    isbn: req.body.isbn,
    publishedOn: req.body.publishedOn,
    numberOfPages: req.body.numberOfPages
  });

  newBook.save().then(book => {
    res.json({ id: book._id });
  });
});

// @route   PUT api/books/:id
// @desc    Update book
// @access  Private
router.put("/:id", (req, res) => {
  const { errors, isValid } = validateBookInput(req.body);

  // Check Validation
  if (!isValid) {
    // If any errors, send 400 with errors object
    return res.status(400).json(errors);
  }

  // Default values
  req.body.publishedOn = !isEmpty(req.body.publishedOn)
    ? req.body.publishedOn
    : 1970;
  req.body.numberOfPages = !isEmpty(req.body.numberOfPages)
    ? req.body.numberOfPages
    : 0;

  Book.findById(req.params.id)
    .then(book => {
      // Update
      Book.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: req.body.title,
          author: req.body.author,
          isbn: req.body.isbn,
          publishedOn: req.body.publishedOn,
          numberOfPages: req.body.numberOfPages
        },
        { new: true }
      ).then(book => res.json());
    })
    .catch(err => res.status(404).json({ error: "No book found" }));
});

// @route   DELETE api/books/:id
// @desc    Delete book
// @access  Private
router.delete("/:id", (req, res) => {
  Book.findById(req.params.id)
    .then(book => {
      // Delete
      book.remove().then(() => res.json());
    })
    .catch(err => res.status(404).json({ error: "No book found" }));
});

module.exports = router;
