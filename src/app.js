const express = require("express");
const cors = require("cors");
const bookRoutes = require("./routes/bookRoutes");
const borrowingRoutes = require("./routes/borrowingRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/borrowings", borrowingRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint not found",
    statusCode: 404,
  });
});

app.use(errorHandler);

module.exports = app;
