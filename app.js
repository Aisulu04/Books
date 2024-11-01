const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Welcome to the Book Store API!');
});

// Sample book data
let books = [
    {
        isbn: '12345',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        reviews: [
            { reviewer: 'Alice', text: 'A fascinating glimpse into the Jazz Age.', rating: 5 },
            
        ]
    },
    {
        isbn: '67890',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        reviews: [
            { reviewer: 'Charlie', text: 'A powerful message about justice.', rating: 4 },
            { reviewer: 'Diana', text: 'A beautifully written story.', rating: 5 }
        ]
    },
    {
        isbn: '54321',
        title: '1984',
        author: 'George Orwell',
        reviews: [
            { reviewer: 'Eve', text: 'Chilling and thought-provoking.', rating: 5 }
        ]
    },
    {
        isbn: '09876',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        reviews: [
            { reviewer: 'Frank', text: 'A delightful romance.', rating: 4 },
            { reviewer: 'Grace', text: 'A bit too slow for my taste.', rating: 3 }
        ]
    },
    {
        isbn: '11111',
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        reviews: [
            { reviewer: 'Hank', text: 'A relatable story about teenage angst.', rating: 4 }
        ]
    }
];

// Middleware for user authentication simulation
let users = []; // Sample user data storage
let loggedInUser = null;

// Task 1: Get the list of all books
app.get('/books', (req, res) => {
    res.json(books);
});

// Task 2: Get a book by ISBN
app.get('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) res.json(book);
    else res.status(404).json({ error: 'Book not found' });
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const authorBooks = books.filter(b => b.author === req.params.author);
    if (authorBooks.length > 0) res.json(authorBooks);
    else res.status(404).json({ error: 'No books found by this author' });
});

// Task 4: Get all books by Title
app.get('/books/title/:title', (req, res) => {
    const titleBooks = books.filter(b => b.title === req.params.title);
    if (titleBooks.length > 0) res.json(titleBooks);
    else res.status(404).json({ error: 'No books found with this title' });
});

// Task 5: Get book reviews by ISBN
app.get('/books/:isbn/review', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) res.json({ reviews: book.reviews });
    else res.status(404).json({ error: 'Book not found' });
});

// Task 6: Register New User
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});

// Task 7: Login as a Registered User
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        loggedInUser = user; // Set logged-in user
        res.json({ message: 'Login successful' });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

// Task 8: Add/Modify a book review (Authenticated)
app.put('/books/:isbn/review', (req, res) => {
    if (!loggedInUser) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        const { reviewer, text, rating } = req.body; // Expecting these in the request body
        book.reviews.push({ reviewer, text, rating }); // Add a new review
        res.json({ message: 'Review added successfully', reviews: book.reviews });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 9: Delete book review added by that particular user (Authenticated)
app.delete('/books/:isbn/review', (req, res) => {
    if (!loggedInUser) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        // Find and remove the review by the logged-in user
        book.reviews = book.reviews.filter(r => r.reviewer !== loggedInUser.username);
        res.json({ message: 'Review deleted successfully', reviews: book.reviews });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Task 10: Get all books – Using async/await
app.get('/async/books', async (req, res) => {
    res.json(books);
});

// Task 11: Search by ISBN – Using Promises
app.get('/promise/books/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === req.params.isbn);
        if (book) resolve(book);
        else reject({ error: 'Book not found' });
    })
        .then(book => res.json(book))
        .catch(err => res.status(404).json(err));
});

// Task 12: Search by Author
app.get('/async/books/author/:author', async (req, res) => {
    const authorBooks = books.filter(b => b.author === req.params.author);
    if (authorBooks.length > 0) res.json(authorBooks);
    else res.status(404).json({ error: 'No books found by this author' });
});

// Task 13: Search by Title
app.get('/async/books/title/:title', async (req, res) => {
    const titleBooks = books.filter(b => b.title === req.params.title);
    if (titleBooks.length > 0) res.json(titleBooks);
    else res.status(404).json({ error: 'No books found with this title' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
