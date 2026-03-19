const express = require('express');
const axios = require('axios');

const router = express.Router();

// Base URL for books data - adjust as needed
const BOOKS_API_URL = process.env.BOOKS_API_URL || 'http://localhost:5000/books.json';

/**
 * Helper function to fetch books using async/await with Axios
 */
async function fetchBooks() {
  try {
    const response = await axios.get(BOOKS_API_URL);
    return response.data; // Returns array of book objects
  } catch (error) {
    throw new Error('Unable to fetch books data');
  }
}

/**
 * GET / - Retrieve all books
 * Uses async/await with Axios
 */
router.get('/', async (req, res) => {
  try {
    const books = await fetchBooks();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving books',
      error: error.message 
    });
  }
});

/**
 * GET /isbn/:isbn - Retrieve book by ISBN
 * Uses async/await with Axios
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
    res.status(500).json({ 
      message: 'Error retrieving book',
      error: error.message 
    });
  }
});

/**
 * GET /author/:author - Retrieve books by author
 * Uses async/await with Axios (case-insensitive, partial match)
 */
router.get('/author/:author', async (req, res) => {
  try {
    const books = await fetchBooks();
    const author = req.params.author.toLowerCase();
    const filteredBooks = books.filter(book => 
      book.author.toLowerCase().includes(author)
    );
    
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving books by author',
      error: error.message 
    });
  }
});

/**
 * GET /title/:title - Retrieve books by title
 * Uses async/await with Axios (case-insensitive, partial match)
 */
router.get('/title/:title', async (req, res) => {
  try {
    const books = await fetchBooks();
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(title)
    );
    
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error retrieving books by title',
      error: error.message 
    });
  }
});

module.exports = router;
