const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController");
const { validateBorrowing } = require("../middleware/validator");

router.post(
  "/",
  validateBorrowing,
  borrowingController.create.bind(borrowingController),
);
router.get("/", borrowingController.getAll.bind(borrowingController));
router.get("/:id", borrowingController.getById.bind(borrowingController));
router.put(
  "/:id",
  validateBorrowing,
  borrowingController.update.bind(borrowingController),
);
router.delete("/:id", borrowingController.delete.bind(borrowingController));

module.exports = router;
