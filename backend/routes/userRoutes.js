import express from 'express';
import User from '../models/User.js';
import { generateToken, protect } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @route   POST /api/users/register
// @access  Public
router.post(
  '/register',
  [
    body('name', 'Name is required').trim().notEmpty(),
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Create user
      user = new User({
        name,
        email,
        password,
      });

      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   POST /api/users/login
// @access  Public
router.post(
  '/login',
  [
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Check user exists and get password
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
