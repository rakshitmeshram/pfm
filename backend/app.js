// Import necessary libraries
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({path: '.env.local'});

// Create an Express application
const app = express();

// Middleware
app.use(express.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing

// Connect to MongoDB
const connectDB = require('./config/dbConfig');
connectDB();

// Test route to check if everything is working
app.get('/', (req, res) => {
  res.send('Personal Finance App Backend is Running');
});


// Placeholder routes for testing (Expense, User, etc.)
// app.get('/test', (req, res) => {
//   res.json({ message: 'API is working fine!' });
// });

// User Route
const userRoutes = require('./routes/userRoutes')
app.use('/api/users', userRoutes)

// Expense Route
const expenseRoutes = require('./routes/expenseRoutes')
app.use('/api/expenses', expenseRoutes)


// Set up the server to listen on a port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
