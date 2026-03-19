const express = require('express');
const router = express.Router();

// In-memory reviews store (key: ISBN, value: array of reviews)
let reviews = {};

// Middleware to check if user is authenticated (using session)
function isAuthenticated(req, res, next) {
  if (req.session.token) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

// Get reviews for a book (public)
router.get('/:isbn/reviews', (req, res) => {
  const isbn = req.params.isbn;
  const bookReviews = reviews[isbn] || [];
  res.status(200).json(bookReviews);
});

// Add or modify a review (authenticated)
router.put('/:isbn/reviews', isAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  if (!review) {
    return res.status(400).json({ message: 'Review text required' });
  }
  const username = jwt.verify(req.session.token, secretKey).username; // decode token
  if (!reviews[isbn]) {
    reviews[isbn] = [];
  }
  // Check if user already reviewed
  const existingIndex = reviews[isbn].findIndex(r => r.username === username);
  if (existingIndex !== -1) {
    // Update existing review
    reviews[isbn][existingIndex].review = review;
    reviews[isbn][existingIndex].date = new Date();
  } else {
    // Add new review
    reviews[isbn].push({ username, review, date: new Date() });
  }
  res.status(200).json({ message: 'Review added/updated successfully', reviews: reviews[isbn] });
});

// Delete a review (authenticated)
router.delete('/:isbn/reviews', isAuthenticated, (req, res) => {
  const isbn = req.params.isbn;
  const username = jwt.verify(req.session.token, secretKey).username;
  if (!reviews[isbn]) {
    return res.status(404).json({ message: 'No reviews for this book' });
  }
  const initialLength = reviews[isbn].length;
  reviews[isbn] = reviews[isbn].filter(r => r.username !== username);
  if (reviews[isbn].length === initialLength) {
    return res.status(404).json({ message: 'Review not found' });
  }
  res.status(200).json({ message: 'Review deleted successfully', reviews: reviews[isbn] });
});

module.exports = router;
