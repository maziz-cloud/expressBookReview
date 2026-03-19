const express = require('express');
const axios = require('axios');

const router = express.Router();

// Base URL for the books data – change to match your deployment
const BOOKS_API_URL = process.env.BOOKS_API_URL || 'http://localhost:5000/books.json';

/**
 * Helper function to fetch books data using Axios
 */
async function fetchBooks() {
  try {
    const response = await axios.get(BOOKS_API_URL);
    return response.data; // expecting an array of book objects
  } catch (error) {
    throw new Error('Failed to fetch books data');
  }
}

/**
 * GET / – Retrieve all books
 */
router.get('/', async (req, res) => {
  try {
    const books = await fetchBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /isbn/:isbn – Retrieve a single book by ISBN
 */
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const books = await fetchBooks();
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /author/:author – Retrieve books by author (case-insensitive, partial match)
 */
router.get('/author/:author', async (req, res) => {
  try {
    const books = await fetchBooks();
    const author = req.params.author.toLowerCase();
    const filtered = books.filter(b => b.author.toLowerCase().includes(author));
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /title/:title – Retrieve books by title (case-insensitive, partial match)
 */
router.get('/title/:title', async (req, res) => {
  try {
    const books = await fetchBooks();
    const title = req.params.title.toLowerCase();
    const filtered = books.filter(b => b.title.toLowerCase().includes(title));
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
