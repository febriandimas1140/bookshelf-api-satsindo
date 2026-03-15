const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBook } = require('../middleware/validator');

router.post('/', validateBook, bookController.create.bind(bookController));
router.get('/', bookController.getAll.bind(bookController));
router.get('/:id', bookController.getById.bind(bookController));
router.put('/:id', validateBook, bookController.update.bind(bookController));
router.delete('/:id', bookController.delete.bind(bookController));

module.exports = router;