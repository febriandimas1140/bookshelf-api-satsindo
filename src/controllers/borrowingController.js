const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const { successResponse, errorResponse } = require("../utils/responseHelper");

class BorrowingController {
  getBorrowingWithBook(borrowingId) {
    const borrowing = db
      .prepare("SELECT * FROM borrowings WHERE id = ?")
      .get(borrowingId);

    if (!borrowing) return null;

    const book = db
      .prepare(
        `
        SELECT id, title, description, year, is_published
        FROM books
        WHERE id = ?
      `,
      )
      .get(borrowing.book_id);

    return {
      ...borrowing,
      book: book
        ? {
            ...book,
            is_published: book.is_published === 1,
          }
        : null,
    };
  }

  create(req, res, next) {
    try {
      const { book_id, borrower, borrowed_at, returned_at } = req.body;
      const book = db.prepare("SELECT * FROM books WHERE id = ?").get(book_id);

      if (!book) {
        return errorResponse(res, "Book not found", 404);
      }

      const id = uuidv4();

      db.prepare(
        `
        INSERT INTO borrowings (id, book_id, borrower, borrowed_at, returned_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      ).run(id, book_id, borrower.trim(), borrowed_at, returned_at || null);

      const result = this.getBorrowingWithBook(id);

      return successResponse(
        res,
        "Borrowing created successfully",
        result,
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  getAll(req, res, next) {
    try {
      const { borrower, borrowed_at, returned_at } = req.query;
      let sql = "SELECT * FROM borrowings WHERE 1=1";
      const params = [];

      // ✅ PERBAIKAN 1: Case insensitive borrower filter
      if (borrower) {
        sql += " AND LOWER(borrower) LIKE LOWER(?)";
        params.push(`%${borrower}%`);
      }

      let orderBy = "borrowed_at DESC";

      if (borrowed_at === "asc") {
        orderBy = "borrowed_at ASC";
      }

      if (borrowed_at === "desc") {
        orderBy = "borrowed_at DESC";
      }

      if (returned_at === "asc") {
        orderBy = "returned_at ASC";
      }

      if (returned_at === "desc") {
        orderBy = "returned_at DESC";
      }

      sql += ` ORDER BY ${orderBy}`;

      const borrowings = db.prepare(sql).all(...params);

      const result = borrowings.map((b) => this.getBorrowingWithBook(b.id));

      // ✅ PERBAIKAN 2: Ganti message sesuai test
      return successResponse(res, "Borrowing retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = this.getBorrowingWithBook(id);

      if (!result) {
        return errorResponse(res, "Borrowing not found", 404);
      }

      return successResponse(res, "Borrowing retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const { id } = req.params;
      const { book_id, borrower, borrowed_at, returned_at } = req.body;
      const existing = db
        .prepare("SELECT * FROM borrowings WHERE id = ?")
        .get(id);

      if (!existing) {
        return errorResponse(res, "Borrowing not found", 404);
      }

      if (book_id && book_id !== existing.book_id) {
        const book = db
          .prepare("SELECT * FROM books WHERE id = ?")
          .get(book_id);

        if (!book) {
          return errorResponse(res, "Book not found", 404);
        }
      }

      const updates = [];
      const params = [];

      if (book_id !== undefined) {
        updates.push("book_id = ?");
        params.push(book_id);
      }

      if (borrower !== undefined) {
        updates.push("borrower = ?");
        params.push(borrower.trim());
      }

      if (borrowed_at !== undefined) {
        updates.push("borrowed_at = ?");
        params.push(borrowed_at);
      }

      if (returned_at !== undefined) {
        updates.push("returned_at = ?");
        params.push(returned_at);
      }

      if (updates.length === 0) {
        return errorResponse(res, "No data to update", 400);
      }

      params.push(id);

      const sql = `UPDATE borrowings SET ${updates.join(", ")} WHERE id = ?`;

      db.prepare(sql).run(...params);

      const result = this.getBorrowingWithBook(id);

      return successResponse(res, "Borrowing updated successfully", result);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const { id } = req.params;
      const existing = db
        .prepare("SELECT * FROM borrowings WHERE id = ?")
        .get(id);

      if (!existing) {
        return errorResponse(res, "Borrowing not found", 404);
      }

      db.prepare("DELETE FROM borrowings WHERE id = ?").run(id);

      return successResponse(res, "Borrowing deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BorrowingController();
