require("dotenv").config();
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  📚 SATSINDO BOOKSHELF API                             ║
╠════════════════════════════════════════════════════════╣
║  🚀 Server running at: http://localhost:${PORT}          ║
║  📖 API Version: v1                                    ║
║  💾 Database: SQLite                                   ║
╠════════════════════════════════════════════════════════╣
║  ENDPOINTS:                                            ║
║  POST   /api/v1/books                                  ║
║  GET    /api/v1/books                                  ║
║  GET    /api/v1/books/:id                              ║
║  PUT    /api/v1/books/:id                              ║
║  DELETE /api/v1/books/:id                              ║
║                                                        ║
║  POST   /api/v1/borrowings                             ║
║  GET    /api/v1/borrowings                             ║
║  GET    /api/v1/borrowings/:id                         ║
║  PUT    /api/v1/borrowings/:id                         ║
║  DELETE /api/v1/borrowings/:id                         ║
╚════════════════════════════════════════════════════════╝
  `);
});
