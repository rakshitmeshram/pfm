const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (userId) => {
  return jwt.sign({ user: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


