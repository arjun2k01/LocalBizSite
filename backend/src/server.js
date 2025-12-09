cat > App.css << 'EOFCSS'
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
.app { display: flex; flex-direction: column; min-height: 100vh; }
.navbar { background: #2c3e50; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.nav-brand { font-size: 1.5rem; font-weight: bold; }
.nav-links { display: flex; gap: 1rem; align-items: center; }
.nav-links button { background: #3498db; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
.nav-links button:hover, .nav-links button.active { background: #2980b9; }
.user-info { padding: 0 1rem; color: #ecf0f1; }
.main-content { flex: 1; padding: 2rem; max-width: 1200px; width: 100%; margin: 0 auto; }
.home-page { text-align: center; padding: 3rem 0; }
.home-page h1 { font-size: 2.5rem; color: #2c3e50; margin-bottom: 1rem; }
.home-page p { font-size: 1.1rem; color: #7f8c8d; margin-bottom: 2rem; }
.cta-button { background: #27ae60; color: white; border: none; padding: 1rem 2rem; font-size: 1rem; border-radius: 4px; cursor: pointer; transition: background 0.3s; }
.cta-button:hover { background: #229954; }
.businesses-page h2, .auth-page h2 { color: #2c3e50; margin-bottom: 2rem; }
.business-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
.business-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
.business-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.business-card h3 { color: #2c3e50; margin-bottom: 0.5rem; }
.business-card p { color: #7f8c8d; margin: 0.5rem 0; font-size: 0.95rem; }
.auth-page { max-width: 400px; margin: 2rem auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.auth-page form { display: flex; flex-direction: column; gap: 1rem; }
.auth-page input { padding: 0.75rem; border: 1px solid #bdc3c7; border-radius: 4px; font-size: 1rem; }
.auth-page button { background: #3498db; color: white; border: none; padding: 0.75rem; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.auth-page button:hover { background: #2980b9; }
.footer { background: #2c3e50; color: white; text-align: center; padding: 2rem; margin-top: auto; }
EOFCSS
cd ../public && cat > index.html << 'EOFHTML'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LocalBizSite - Discover Local Businesses</title>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; -webkit-font-smoothing: antialiased; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="%PUBLIC_URL%/index.js"></script>
</body>
</html>
EOFHTML
cd /workspaces/LocalBizSite && git add -A && git commit -m 'Add complete React frontend with authentication, business listing, and responsive design' && git push
cat package.json
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const businessRoutes = require('./routes/businessRoutes');
const leadRoutes = require('./routes/leadRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localbizsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'Server is running',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔌 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
