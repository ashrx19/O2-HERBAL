import express from 'express';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateToken, protect } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Helper function to generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/users/send-otp
// @desc    Send OTP to email or phone
// @access  Public
router.post(
  '/send-otp',
  [
    body('identifier', 'Email or phone is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { identifier } = req.body;

      // Generate 6-digit OTP
      const otp = generateOTP();

      // Check if OTP already exists for this identifier
      let otpRecord = await OTP.findOne({ identifier });
      if (otpRecord) {
        otpRecord.otp = otp;
        otpRecord.expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        otpRecord.attempts = 0;
      } else {
        otpRecord = new OTP({
          identifier,
          otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        });
      }

      await otpRecord.save();

      // In production: Send via SMS/Email service
      console.log(`📧 OTP for ${identifier}: ${otp}`);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully (Check console for dummy OTP)',
        // For demo purposes, show OTP in response (REMOVE IN PRODUCTION)
        demoOTP: otp,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// @route   POST /api/users/verify-otp
// @desc    Verify OTP and create/login user
// @access  Public
router.post(
  '/verify-otp',
  [
    body('identifier', 'Email or phone is required').notEmpty(),
    body('otp', 'OTP is required').isLength({ min: 6, max: 6 }),
    body('name', 'Name is required').trim().notEmpty(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { identifier, otp, name, password } = req.body;

      // Find OTP record
      const otpRecord = await OTP.findOne({ identifier });
      if (!otpRecord) {
        return res.status(400).json({ success: false, message: 'OTP not found. Request a new OTP.' });
      }

      // Check if OTP expired
      if (otpRecord.expiresAt < Date.now()) {
        return res.status(400).json({ success: false, message: 'OTP expired. Request a new OTP.' });
      }

      // Check OTP match
      if (otpRecord.otp !== otp) {
        otpRecord.attempts += 1;
        await otpRecord.save();
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }

      // Check if max attempts exceeded
      if (otpRecord.attempts >= 5) {
        return res.status(400).json({ success: false, message: 'Too many attempts. Request a new OTP.' });
      }

      // OTP verified - create or find user
      let user = await User.findOne({ email: identifier });

      if (!user) {
        // Create new user
        user = new User({
          name,
          email: identifier,
          password,
        });
        await user.save();
      }

      // Delete OTP record after successful verification
      await OTP.deleteOne({ _id: otpRecord._id });

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
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
