const { errorResponse } = require("../utils/responseHelper");

function validateBook(req, res, next) {
  const { title, year, is_published } = req.body;
  const errors = [];

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Title is required");
  }

  if (year !== undefined && year !== null) {
    const yearNum = parseInt(year);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
      errors.push("Year must be a valid 4-digit number");
    }
  }

  if (is_published !== undefined && typeof is_published !== "boolean") {
    errors.push("is_published must be boolean");
  }

  if (errors.length > 0) {
    return errorResponse(res, errors.join(", "), 400);
  }

  next();
}

function validateBorrowing(req, res, next) {
  const { book_id, borrower, borrowed_at, returned_at } = req.body;
  const errors = [];

  if (!book_id || typeof book_id !== "string" || book_id.trim() === "") {
    errors.push("book_id is required");
  }

  if (!borrower || typeof borrower !== "string" || borrower.trim() === "") {
    errors.push("borrower is required");
  }

  if (!borrowed_at) {
    errors.push("borrowed_at is required");
  } else {
    const borrowDate = new Date(borrowed_at);
    if (isNaN(borrowDate.getTime())) {
      errors.push("borrowed_at must be valid ISO 8601 date");
    }
  }

  if (returned_at) {
    const returnDate = new Date(returned_at);
    if (isNaN(returnDate.getTime())) {
      errors.push("returned_at must be valid ISO 8601 date");
    }

    if (borrowed_at) {
      const borrowDate = new Date(borrowed_at);
      if (returnDate <= borrowDate) {
        errors.push("returned_at must be greater than borrowed_at");
      }
    }
  }

  if (errors.length > 0) {
    return errorResponse(res, errors.join(", "), 400);
  }

  next();
}

module.exports = {
  validateBook,
  validateBorrowing,
};
