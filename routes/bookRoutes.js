const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Define a route to get all books
router.get('/', bookController.getAllBooks);

// Define a route to get a specific book by ID
router.get('/:id', bookController.getBookById);

// Define a route to create a new book
router.post('/', bookController.createBook);

// Define a route to update an existing book by ID
router.put('/:id', bookController.updateBook);

// Define a route to delete a book by ID
router.delete('/:id', bookController.deleteBook);

module.exports = router;
