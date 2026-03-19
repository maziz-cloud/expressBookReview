const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const generalRouter = require('./router/general');
const authRouter = require('./router/auth');
const booksRouter = require('./router/books');

const app = express();
app.use(express.json());

// Session setup (for token storage)
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

// Routes
app.use('/', generalRouter);          // for /, /isbn/:isbn, /author/:author, /title/:title
app.use('/auth', authRouter);          // for /auth/register, /auth/login
app.use('/books', booksRouter);        // for /books/:isbn/reviews

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
