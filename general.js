const express = require('express');
const axios = require('axios'); // if using Axios
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();

// Helper: read books.json using async/await
async function getBooksData() {
  // Using fs (if file is local)
  const data = await fs.readFile(path.join(__dirname, '../books.json'), 'utf-8');
  return JSON.parse(data);

  // Alternative using Axios (if books.json is served statically):
  // const response = await axios.get('http://localhost:5000/books.json');
  // return response.data;
}

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await getBooksData();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book by ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const books = await getBooksData();
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving book' });
  }
});

// Get books by author
router.get('/author/:author', async (req, res) => {
  try {
    const books = await getBooksData();
    const author = req.params.author.toLowerCase();
    const filtered = books.filter(b => b.author.toLowerCase().includes(author));
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get books by title
router.get('/title/:title', async (req, res) => {
  try {
    const books = await getBooksData();
    const title = req.params.title.toLowerCase();
    const filtered = books.filter(b => b.title.toLowerCase().includes(title));
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

module.exports = router;
