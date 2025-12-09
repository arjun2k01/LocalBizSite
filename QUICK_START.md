# LocalBizSite - Quick Start Guide 🚀

## For Developers (You)

This guide helps you quickly start building and deploying LocalBizSite like a pro.

---

## 📋 What You'll Build

A multi-tenant SaaS platform where:
- **Business Owners** create & manage their mini-websites
- **Visitors** discover businesses and submit leads  
- **Admins** manage all users and businesses

---

## 🎯 Step 1: Prerequisites (15 mins)

### Create Accounts (Free):

1. **MongoDB Atlas** → https://www.mongodb.com/cloud/atlas
   - Create free cluster (M0 tier)
   - Create database user
   - Get connection string

2. **Cloudinary** → https://cloudinary.com
   - Sign up (free tier)
   - Get Cloud Name, API Key, API Secret

3. **Render** → https://render.com
   - For backend deployment

4. **Vercel** → https://vercel.com  
   - For frontend deployment

---

## 🏗️ Step 2: Local Setup (30 mins)

### Clone & Setup:

```bash
# Clone
git clone https://github.com/arjun2k01/LocalBizSite.git
cd LocalBizSite

# Setup Backend
cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken morgan helmet express-rate-limit multer cloudinary stripe nodemailer
npm install -D nodemon eslint prettier

# Create .env
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/localbizsite
JWT_ACCESS_SECRET=your_long_secret_key_min_32_chars_here
JWT_REFRESH_SECRET=your_other_secret_key_min_32_chars_here
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLIENT_BASE_URL=http://localhost:5173
NODE_ENV=development
EOF

# Create folder structure
mkdir -p src/{config,models,middleware,routes,controllers,utils}

# Setup Frontend
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios zustand react-hook-form zod @hookform/resolvers recharts react-toastify
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Create .env.local
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=LocalBizSite
EOF
```

---

## 💻 Step 3: Implement Backend (2-3 hours)

### Follow IMPLEMENTATION_GUIDE.md for:

1. Create `backend/src/server.js` - Main server
2. Create `backend/src/models/` - User, Business, Lead
3. Create `backend/src/routes/` - Auth, Business, Leads, Analytics
4. Create `backend/src/middleware/` - Auth, Admin checks
5. Create `backend/src/controllers/` - Business logic

### Add to package.json scripts:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

### Test Backend:

```bash
cd backend
npm run dev

# In another terminal
curl http://localhost:5000/api/health
```

---

## 🎨 Step 4: Implement Frontend (3-4 hours)

### Create these components:

**Pages:**
- `/pages/auth/LoginPage.jsx`
- `/pages/auth/SignupPage.jsx`
- `/pages/dashboard/DashboardHome.jsx`
- `/pages/dashboard/BusinessEditPage.jsx`
- `/pages/dashboard/AnalyticsPage.jsx`
- `/pages/dashboard/LeadsPage.jsx`
- `/pages/publicSite/BusinessSitePage.jsx`
- `/pages/admin/AdminDashboardPage.jsx`

**Components:**
- UI: `Button.jsx`, `Input.jsx`, `Card.jsx`, `Modal.jsx`, `Badge.jsx`
- Business: `BusinessForm.jsx`, `ServicesEditor.jsx`, `GalleryUploader.jsx`
- Charts: `AnalyticsCharts.jsx` (using Recharts)

**Hooks:**
- `useAuth.js` - Auth state management (Zustand)
- `useBusiness.js` - Business data management

**Setup Tailwind:**

```css
/* frontend/src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Test Frontend:

```bash
cd frontend
npm run dev
# Visit http://localhost:5173
```

---

## 🚀 Step 5: Deploy Backend (Render) - 10 mins

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repo (arjun2k01/LocalBizSite)
4. Fill details:
   - **Name:** localbizsite-backend
   - **Region:** Choose closest
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables (copy from .env)
6. Click Deploy
7. Wait for green status ✅
8. Copy URL: `https://yourdomain.onrender.com`

---

## 🚀 Step 6: Deploy Frontend (Vercel) - 5 mins

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import GitHub repo
4. Settings:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   - `VITE_API_URL` = Your Render backend URL
6. Deploy
7. Get URL: `https://yourdomain.vercel.app`

---

## 🔗 Step 7: Connect Everything

After deployment, update URLs:

**In Render Backend Dashboard:**
- Add Environment Variable:
  - Key: `CORS_ORIGIN`
  - Value: `https://yourdomain.vercel.app`
- Redeploy

**In Frontend Code:**
- Update `vite.config.js` or environment to point to Render URL
- Redeploy on Vercel

---

## ✅ Testing Checklist

- [ ] Backend health check: `GET /api/health`
- [ ] User signup: `POST /api/auth/signup`
- [ ] User login: `POST /api/auth/login`
- [ ] Create business: `POST /api/businesses`
- [ ] Get business: `GET /api/businesses/me`
- [ ] Public site loads: `GET /api/businesses/slug/:slug`
- [ ] Frontend loads without CORS errors
- [ ] Login works on frontend
- [ ] Dashboard shows business data
- [ ] Analytics page loads

---

## 🐛 Common Issues & Fixes

### CORS Error
```
Access-Control-Allow-Origin is missing
```
**Fix:** Update CORS_ORIGIN in backend .env and redeploy

### MongoDB Connection Error
```
Failed to connect to MongoDB
```
**Fix:** 
- Check IP whitelist in MongoDB Atlas
- Verify connection string
- Ensure database user exists

### Port 5000 Already in Use
```bash
# Find process
lsof -i :5000

# Kill it
kill -9 <PID>
```

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation Files

1. **README.md** - Project overview & specs
2. **SETUP_GUIDE.md** - Detailed setup instructions  
3. **IMPLEMENTATION_GUIDE.md** - Code examples & implementation
4. **QUICK_START.md** - This file (fastest way)

---

## 🎓 Next Features to Add

1. **Cloudinary Integration** - Image uploads
2. **Stripe/Razorpay** - Payment processing
3. **Email Notifications** - Lead alerts
4. **Advanced Analytics** - Charts & reports
5. **Admin Dashboard** - User management
6. **Multi-language** - i18n support
7. **SEO Optimization** - Meta tags
8. **Email Verification** - Account confirmation

---

## 💬 Pro Tips

✅ **Always test locally before deploying**
✅ **Keep .env files in .gitignore**
✅ **Use environment-specific variables**
✅ **Monitor Render/Vercel logs for errors**
✅ **Test on mobile devices**
✅ **Use Postman/Insomnia for API testing**
✅ **Enable HTTPS in production**
✅ **Setup database backups**

---

## 📞 Support

If stuck:
1. Check the error logs
2. Review documentation files
3. Check GitHub issues
4. Test API endpoints with Postman
5. Verify all env variables are set

---

**You've got this! Build something amazing! 🚀**
