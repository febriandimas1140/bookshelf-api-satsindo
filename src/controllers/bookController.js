const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const { generateSlug } = require("../utils/slugGenerator");

class BookController {
  create(req, res, next) {
    try {
      const { title, description, year, is_published } = req.body;

      const id = uuidv4();
      const slug = generateSlug(title);
      const now = new Date().toISOString();

      const insert = db.prepare(`
        INSERT INTO books (id, title, description, slug, year, is_published, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insert.run(
        id,
        title.trim(),
        description || null,
        slug,
        year || null,
        is_published ? 1 : 0,
        now,
        now,
      );

      const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

      const formattedBook = {
        ...book,
        is_published: book.is_published === 1,
      };

      return successResponse(
        res,
        "Book created successfully",
        formattedBook,
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  getAll(req, res, next) {
    try {
      const { is_published, year } = req.query;

      let sql = "SELECT * FROM books WHERE 1=1";
      const params = [];

      if (is_published !== undefined) {
        sql += " AND is_published = ?";
        params.push(is_published === "true" ? 1 : 0);
      }

      if (year === "asc") {
        sql += " ORDER BY year ASC";
      } else if (year === "desc") {
        sql += " ORDER BY year DESC";
      } else {
        sql += " ORDER BY created_at DESC";
      }

      const books = db.prepare(sql).all(...params);

      const formattedBooks = books.map((book) => ({
        ...book,
        is_published: book.is_published === 1,
      }));

      return successResponse(
        res,
        "Books retrieved successfully",
        formattedBooks,
      );
    } catch (error) {
      next(error);
    }
  }

  getById(req, res, next) {
    try {
      const { id } = req.params;

      const book = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

      if (!book) {
        return errorResponse(res, "Book not found", 404);
      }

      const formattedBook = {
        ...book,
        is_published: book.is_published === 1,
      };

      return successResponse(res, "Book retrieved successfully", formattedBook);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, year, is_published } = req.body;

      const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
      if (!existing) {
        return errorResponse(res, "Book not found", 404);
      }

      const updates = [];
      const params = [];
      const now = new Date().toISOString();

      if (title !== undefined) {
        updates.push("title = ?");
        params.push(title.trim());
        updates.push("slug = ?");
        params.push(generateSlug(title));
      }

      if (description !== undefined) {
        updates.push("description = ?");
        params.push(description);
      }

      if (year !== undefined) {
        updates.push("year = ?");
        params.push(year);
      }

      if (is_published !== undefined) {
        updates.push("is_published = ?");
        params.push(is_published ? 1 : 0);
      }

      updates.push("updated_at = ?");
      params.push(now);
      params.push(id);

      const sql = `UPDATE books SET ${updates.join(", ")} WHERE id = ?`;
      db.prepare(sql).run(...params);

      const updated = db.prepare("SELECT * FROM books WHERE id = ?").get(id);

      return successResponse(res, "Book updated successfully", {
        ...updated,
        is_published: updated.is_published === 1,
      });
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      const { id } = req.params;

      const existing = db.prepare("SELECT * FROM books WHERE id = ?").get(id);
      if (!existing) {
        return errorResponse(res, "Book not found", 404);
      }

      db.prepare("DELETE FROM books WHERE id = ?").run(id);

      return successResponse(res, "Book deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookController();
