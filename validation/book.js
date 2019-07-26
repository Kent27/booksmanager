const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.author = !isEmpty(data.author) ? data.author : "";
  data.publishedOn = !isEmpty(data.publishedOn) ? data.publishedOn : "1970";
  data.numberOfPages = !isEmpty(data.numberOfPages) ? data.numberOfPages : "0";

  if (!Validator.isLength(data.title, { min: 2, max: 30 })) {
    errors.title = "Title must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }

  if (!Validator.isLength(data.author, { min: 2, max: 20 })) {
    errors.author = "Author must be between 2 and 20 characters";
  }

  if (Validator.isEmpty(data.author)) {
    errors.author = "Author field is required";
  }

  if (!Validator.isNumeric(data.publishedOn)) {
    errors.publishedOn = "Published year must be numeric";
  }

  if (!Validator.isNumeric(data.numberOfPages)) {
    errors.numberOfPages = "Number of pages must be numeric";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
