const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbPath = process.env.DB_PATH || "./database/bookshelf.sqlite";
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      slug TEXT UNIQUE NOT NULL,
      year INTEGER,
      is_published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS borrowings (
      id TEXT PRIMARY KEY,
      book_id TEXT NOT NULL,
      borrower TEXT NOT NULL,
      borrowed_at DATETIME NOT NULL,
      returned_at DATETIME,
      FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
    )
  `);

  db.exec(`CREATE INDEX IF NOT EXISTS idx_books_slug ON books(slug)`);
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_borrowings_book_id ON borrowings(book_id)`,
  );
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_borrowings_borrower ON borrowings(borrower)`,
  );
}

initDatabase();

module.exports = db;
