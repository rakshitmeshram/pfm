const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

const auth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token
  // console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password') // Attach user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};



module.exports = auth;
