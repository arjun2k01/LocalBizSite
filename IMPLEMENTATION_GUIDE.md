# LocalBizSite - Complete Implementation Guide

## PART 1: BACKEND IMPLEMENTATION

### Backend Core Files to Create

Follow this structure and create these files in your `backend/src/` directory.

---

## BACKEND FILES

### 1. backend/src/server.js

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const businessRoutes = require('./routes/businessRoutes');
const leadRoutes = require('./routes/leadRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localbizsite')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 2. backend/src/config/db.js

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3. backend/src/models/User.js

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true 
  },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['owner', 'admin'], 
    default: 'owner' 
  },
  planKey: { 
    type: String, 
    enum: ['free', 'pro'], 
    default: 'free' 
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
```

### 4. backend/src/models/Business.js

```javascript
const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  tagline: String,
  description: String,
  category: { 
    type: String, 
    enum: ['gym', 'salon', 'restaurant', 'clinic', 'tutor', 'other'],
    default: 'other'
  },
  language: { 
    type: String, 
    enum: ['en', 'local'], 
    default: 'en' 
  },
  
  // Contact
  address: String,
  city: String,
  country: String,
  whatsappNumber: String,
  phoneNumber: String,
  email: String,
  googleMapsUrl: String,
  
  // Media
  logoUrl: String,
  heroImageUrl: String,
  galleryImages: [String],
  
  // Services
  services: [{
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: String,
    description: String,
    durationMinutes: Number,
    isFeatured: Boolean
  }],
  
  // Theme
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#10B981' },
    layout: { type: String, enum: ['classic', 'modern', 'minimal'], default: 'modern' },
    fontFamily: { type: String, enum: ['sans', 'serif', 'display'], default: 'sans' },
    darkMode: { type: Boolean, default: false }
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    ogImageUrl: String
  },
  
  // Stats
  stats: {
    totalViews: { type: Number, default: 0 },
    totalWhatsAppClicks: { type: Number, default: 0 },
    totalCallClicks: { type: Number, default: 0 },
    totalLeadSubmissions: { type: Number, default: 0 }
  },
  
  // Flags
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', BusinessSchema);
```

### 5. backend/src/models/Lead.js

```javascript
const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  name: String,
  email: String,
  phone: String,
  message: String,
  source: { 
    type: String, 
    enum: ['contact_form', 'cta_button'],
    default: 'contact_form'
  },
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
```

### 6. backend/src/middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminOnlyMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminOnlyMiddleware };
```

### 7. backend/src/routes/authRoutes.js

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    const user = new User({
      name,
      email,
      passwordHash: password,
      role: 'owner',
      planKey: 'free'
    });
    
    await user.save();
    
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    user.lastLoginAt = new Date();
    await user.save();
    
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);
    
    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, planKey: user.planKey },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Refresh Token
router.post('/refresh', (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id, decoded.role);
    
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

module.exports = router;
```

---

## Continue with:
- frontend Implementation (React, Tailwind, Pages, Components)
- Advanced Features (Cloudinary, Stripe, Email)
- Testing & Deployment Instructions

For the full implementation, follow SETUP_GUIDE.md which covers all setup steps.
