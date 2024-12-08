const express = require('express');
const auth = require('../middlewares/authMiddleware');  // Authentication Middleware
const { loginUser, registerUser, getUser } = require('../controllers/userController');

const router = express.Router();

//console.log(loginUser, registerUser, getUser)


// Route: POST /api/users/register
// Register a new user
router.post('/register', registerUser);

// Route: POST /api/users/login
// Login existing user and return token
router.post('/login', loginUser);

// Route: GET /api/users/me
// Get logged-in user details (protected route)
router.get('/me', auth, getUser);

module.exports = router;
