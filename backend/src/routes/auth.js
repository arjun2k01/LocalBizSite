const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const userModel = require('../models/users');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = '7d';

// ============================================
// RATE LIMITING - FIX HIGH PRIORITY RISK #3
// ============================================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many auth attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // More lenient for login (user might forget password)
  message: 'Too many login attempts. Please try again later.',
  skipSuccessfulRequests: false
});

// ============================================
// PASSWORD STRENGTH VALIDATION
// FIX HIGH PRIORITY RISK #2
// ============================================
const validatePassword = (password) => {
  // At least 8 characters
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  // At least one number
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  // At least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&* etc.)';
  }
  return null;
};

// Helper: Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// ============================================
// FIX HIGH PRIORITY RISK #1
// ENHANCED SIGNUP WITH VALIDATION
// ============================================
router.post('/signup', authLimiter, [
  // Input validation
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage('Password must contain a special character'),
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array().map(e => ({ field: e.param, message: e.msg }))
      });
    }

    const { email, password, fullName } = req.body;

    // Double-check password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    // Create user
    const user = await userModel.createUser(email, password, fullName);
    const token = generateToken(user.id);

    // Log successful signup (for monitoring)
    console.log(`[SIGNUP] New user: ${user.email} at ${new Date().toISOString()}`);

    res.status(201).json({
      message: 'User registered successfully. Please log in.',
      user,
      token
    });
  } catch (error) {
    console.error('[SIGNUP ERROR]', error.message);
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    res.status(400).json({ error: error.message });
  }
});

// ============================================
// ENHANCED LOGIN WITH RATE LIMITING
// ============================================
router.post('/login', loginLimiter, [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      console.warn(`[LOGIN FAILED] Unknown email: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }

    // Verify password
    const isPasswordValid = await userModel.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      console.warn(`[LOGIN FAILED] Wrong password for: ${email}`);
      return res.status(401).json({ 
        error: 'Invalid credentials',
        timestamp: new Date().toISOString()
      });
    }

    // Generate token
    const token = generateToken(user.id);

    console.log(`[LOGIN] User: ${user.email} at ${new Date().toISOString()}`);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      token,
      expiresIn: JWT_EXPIRE
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ============================================
// GET USER PROFILE (Protected)
// ============================================
router.get('/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = userModel.findUserById(decoded.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        expiredAt: error.expiredAt
      });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============================================
// VALIDATE TOKEN (Frontend helper)
// ============================================
router.post('/validate-token', (req, res) => {
  try {
    const token = req.body.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ valid: false, message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, message: 'Token is valid' });
  } catch (error) {
    res.json({ valid: false, message: error.message });
  }
});

// ============================================
// LOGOUT (Frontend should delete token)
// ============================================
router.post('/logout', (req, res) => {
  // Logout is handled client-side by deleting the token
  // This endpoint can be used for logging purposes
  console.log('[LOGOUT] User logged out');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
