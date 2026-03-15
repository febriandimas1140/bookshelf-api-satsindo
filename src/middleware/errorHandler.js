const { errorResponse } = require("../utils/responseHelper");

function errorHandler(err, req, res, next) {
  if (
    err.message &&
    err.message.includes("UNIQUE constraint failed: books.slug")
  ) {
    return errorResponse(res, "Book with this title already exists", 409);
  }

  if (err.message && err.message.includes("FOREIGN KEY constraint failed")) {
    return errorResponse(res, "Book not found for this borrowing", 422);
  }

  if (err.message && err.message.includes("datatype mismatch")) {
    return errorResponse(res, "Invalid data type provided", 422);
  }

  return errorResponse(res, err.message || "Internal Server Error", 500);
}

module.exports = errorHandler;
