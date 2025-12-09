# LocalBizSite - Complete Development & Deployment Guide

This guide will help you build, deploy, and test the entire LocalBizSite MERN application.

## TABLE OF CONTENTS
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Database Configuration](#database-configuration)
6. [Environment Setup](#environment-setup)
7. [Testing](#testing)
8. [Deployment](#deployment)

---

## Prerequisites

- **Node.js** v16+ and npm v8+
- **MongoDB Atlas** account (cloud database)
- **Cloudinary** account (image hosting)
- **Stripe/Razorpay** account (optional, for payments)
- **Render** account (for backend deployment)
- **Vercel** account (for frontend deployment)
- **Git** installed locally

---

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/arjun2k01/LocalBizSite.git
cd LocalBizSite
```

### 2. Create Folder Structure

```bash
mkdir -p backend/src/{config,models,middleware,routes,controllers,utils}
mkdir -p frontend/src/{api,components/{layout,ui,business,publicSite},hooks,pages/{auth,dashboard,publicSite,admin},router,styles}
```

---

## Backend Development

### 1. Initialize Backend

```bash
cd backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install \
  express \
  mongoose \
  dotenv \
  cors \
  bcryptjs \
  jsonwebtoken \
  cookie-parser \
  morgan \
  helmet \
  express-rate-limit \
  multer \
  cloudinary \
  stripe \
  nodemailer \
  compression \
  express-validator

npm install -D \
  nodemon \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-import
```

### 3. Create Backend Files

Create `.env` in backend/:

```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/localbizsite
JWT_ACCESS_SECRET=your_super_secret_access_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLIENT_BASE_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL="LocalBizSite <noreply@localbizsite.com>"
NODE_ENV=development
```

### 4. Create package.json Scripts

Add to backend/package.json:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "lint": "eslint src/",
  "format": "prettier --write src/"
}
```

---

## Frontend Development

### 1. Create React App with Vite

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

### 2. Install Dependencies

```bash
npm install \
  react-router-dom \
  axios \
  zustand \
  react-hook-form \
  zod \
  @hookform/resolvers \
  recharts \
  clsx \
  date-fns \
  lucide-react \
  react-toastify

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  eslint-config-prettier
```

### 3. Setup Tailwind CSS

```bash
npx tailwindcss init -p
```

Edit `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
  plugins: [],
}
```

### 4. Create index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
```

### 5. Create .env.local

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LocalBizSite
```

---

## Database Configuration

### MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user with username and password
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/localbizsite`
5. Add your IP to IP Whitelist

---

## Environment Setup

### Important Notes

- Never commit `.env` files to Git
- Add `.env` to `.gitignore`
- Use `.env.example` for reference

### Create .gitignore

```
node_modules/
.env
.env.local
.env.*.local
dist/
build/
.DS_Store
*.log
.vscode/
.idea/
```

---

## Testing

### Run Backend

```bash
cd backend
npm run dev
# Should show: Server running on http://localhost:5000
```

### Run Frontend

```bash
cd frontend
npm run dev
# Should show: Local: http://localhost:5173
```

### Test API

Use Postman or curl:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

---

## Deployment

### Step 1: Deploy Backend to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect your GitHub repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Import your GitHub repo
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variables
7. Deploy

### Step 3: Update CORS and URLs

After deployment:
- Update `CORS_ORIGIN` in backend `.env` with Vercel URL
- Update `VITE_API_URL` in frontend with Render URL
- Redeploy both

---

## Quick Start Commands

```bash
# Install everything
cd backend && npm install && cd ../frontend && npm install

# Start development
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Test production build
cd frontend && npm run preview
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process on port 5000
lsof -i :5000
# Kill process
kill -9 <PID>
```

### MongoDB Connection Error

- Check IP whitelist in MongoDB Atlas
- Verify connection string
- Ensure database user has correct permissions

### CORS Errors

- Update CORS_ORIGIN in backend .env
- Ensure frontend URL matches allowed origin

### Module Not Found

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

1. Implement all backend models and routes
2. Create all frontend pages and components
3. Integrate Cloudinary for image uploads
4. Setup payment integration
5. Add email notifications
6. Implement analytics
7. Add admin panel functionality
8. Test thoroughly
9. Deploy to production

---

## Support

For issues or questions, create an issue in the GitHub repository.

**Happy Coding! 🚀**
