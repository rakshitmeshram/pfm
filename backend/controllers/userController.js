const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/authUtils');

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to DB
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Send response with token
    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);  // Generate the JWT token
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getUser = async (req, res) => {
  try {
    // Assuming the user data is attached to req.user by authMiddleware
    const user = await User.findById(req.params.userId).select('-password');
    if(!user){
      return res.status(404).json({message: 'User not found'});
    }
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  loginUser, 
  registerUser, 
  getUser 
};
