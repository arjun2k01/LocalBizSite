# LocalBizSite

# LocalBizSite – Advanced MERN SaaS for Local Business Websites  

> **Goal:** A complete specification + guide so you (or an AI) can build the entire app end-to-end.  
> This file is meant to be used directly as `README.md` in your GitHub repository.

---

## 1. Project Overview

### 1.1 One-Line Description

Build a multi-tenant SaaS platform where local businesses can create and manage their own mini-websites in minutes by filling out forms. Each business gets a unique, SEO-friendly public page with services, gallery, contact info, and WhatsApp/phone CTAs.

### 1.2 Roles

- **Visitor**
  - Views any published business site.
  - Submits contact/lead forms.
  - Clicks WhatsApp / Call / Maps CTAs.

- **Business Owner**
  - Signs up / logs in.
  - Configures their business website.
  - Manages services, gallery, theme, and SEO.
  - Views analytics and leads.

- **Admin**
  - Manages users and businesses.
  - Blocks/unblocks users and businesses.
  - Controls plans (Free/Pro) and limits.
  - Marks businesses as featured.

### 1.3 Tech Stack (MERN)

- **Frontend**
  - React
  - React Router
  - Tailwind CSS
  - State management: Context API or Zustand / Redux Toolkit
  - Charts: Recharts (or similar)

- **Backend**
  - Node.js
  - Express.js

- **Database**
  - MongoDB Atlas (cloud)

- **Auth**
  - JWT-based authentication (Access + Refresh tokens)

- **File Storage**
  - Cloudinary (for logos and gallery images)

- **Payments (Advanced/Optional)**
  - Stripe or Razorpay

- **Deployment**
  - Frontend: Vercel
  - Backend: Render / Railway / similar
  - DB: MongoDB Atlas

---

## 2. Features

### 2.1 MVP Features

- User authentication:
  - Signup, login, logout with JWT.
- Owner dashboard:
  - Create or edit a single business profile.
  - Manage services list.
  - Manage gallery (images).
  - Manage contact info and address.
  - Choose theme (colors/layout).
- Public business site:
  - Accessible at `/site/:slug`.
  - Sections: Hero, About, Services, Gallery, Contact.
  - WhatsApp, Call, and Google Maps buttons.
- Basic analytics:
  - Total views.
  - Total CTA clicks.
- Fully responsive design (mobile-first).

### 2.2 Advanced Features

- Role-based access control (`owner`, `admin`).
- Multiple themes/layouts.
- Localization (e.g., English + one local language).
- Detailed analytics:
  - Views by day.
  - WhatsApp/Call click counts.
  - Lead submissions over time.
- Built-in lead/contact form:
  - Leads visible in dashboard.
  - Lead status tracking.
- Subscription plans:
  - Free vs Pro with different limits.
- Admin panel:
  - Manage all users and businesses.
  - Block businesses or users.
  - Mark businesses as featured.
- SEO improvements:
  - Custom meta title and description.
  - Open Graph image.
  - Sitemap endpoint.

---

## 3. Project Structure

### 3.1 Monorepo Layout (Recommended)

```bash
localbizsite/
  backend/
  frontend/
  README.md


---

4. Dependencies (All Libraries Required)

4.1 Backend (Node + Express)

Install in backend/:

4.1.1 Runtime Dependencies

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
  nodemailer

Usage summary:

express – HTTP server and routing.

mongoose – MongoDB ODM.

dotenv – Environment variables.

cors – Cross-origin resource sharing.

bcryptjs – Password hashing.

jsonwebtoken – JWT auth.

cookie-parser – Handle cookies (optional, if using cookie-based refresh tokens).

morgan – HTTP request logging.

helmet – Security headers.

express-rate-limit – Basic rate limiting.

multer – Handling file uploads (before sending to Cloudinary).

cloudinary – Image hosting integration.

stripe – Payment integration (or Razorpay if you choose).

nodemailer – Sending email notifications (e.g., lead alerts).


4.1.2 Dev Dependencies

npm install -D \
  nodemon \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-import

nodemon – Auto-restart server during development.

eslint + prettier + related configs – Code quality and formatting.



---

4.2 Frontend (React)

Install in frontend/:

4.2.1 Core + UI

If using Vite:

npm create vite@latest frontend -- --template react
cd frontend

Then:

npm install \
  react-router-dom \
  axios \
  zustand \
  react-hook-form \
  zod \
  recharts \
  clsx

react-router-dom – Routing.

axios – HTTP client.

zustand – Global state store (auth, user, etc.). (Alternatively Redux Toolkit)

react-hook-form – Forms.

zod – Validation schemas.

recharts – Charts for analytics.

clsx – Conditional className utilities.


4.2.2 Tailwind CSS + PostCSS

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

4.2.3 Dev Dependencies

npm install -D \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-plugin-react-hooks \
  eslint-plugin-react-refresh \
  prettier \
  eslint-config-prettier

> TypeScript eslint plugins are optional if you stay with plain JS, but useful if you migrate.




---

5. Backend Detailed Specification

5.1 Folder Structure

backend/
  src/
    config/
      db.js
      cloudinary.js
    models/
      User.js
      Business.js
      Lead.js
      Plan.js
      Event.js
    middleware/
      auth.js
      errorHandler.js
      rateLimiter.js
      adminOnly.js
    routes/
      authRoutes.js
      userRoutes.js
      businessRoutes.js
      leadRoutes.js
      adminRoutes.js
      analyticsRoutes.js
      paymentRoutes.js
    controllers/
      authController.js
      userController.js
      businessController.js
      leadController.js
      adminController.js
      analyticsController.js
      paymentController.js
    utils/
      generateSlug.js
      tokenUtils.js
      validation.js
    server.js
  .env
  package.json


---

5.2 Environment Variables (backend/.env)

PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_key
CLIENT_BASE_URL=http://localhost:5173

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your_email_user
SMTP_PASS=your_email_password
FROM_EMAIL="LocalBizSite <no-reply@localbizsite.com>"


---

5.3 Database Models (Pseudocode)

5.3.1 User Model (models/User.js)

User {
  _id: ObjectId
  name: String (required)
  email: String (required, unique, lowercase, trim)
  passwordHash: String (required)
  role: Enum('owner', 'admin') default 'owner'
  planKey: String ('free' or 'pro') default 'free'
  isActive: Boolean default true
  lastLoginAt: Date
  createdAt: Date
  updatedAt: Date
}

5.3.2 Business Model (models/Business.js)

Business {
  _id: ObjectId
  owner: ObjectId (ref User, required)

  name: String (required)
  slug: String (required, unique, lowercase)
  tagline: String
  description: String
  category: Enum('gym', 'salon', 'restaurant', 'clinic', 'tutor', 'other')
  language: Enum('en', 'local') default 'en'

  // Contact
  address: String
  city: String
  country: String
  whatsappNumber: String
  phoneNumber: String
  email: String
  googleMapsUrl: String

  // Media
  logoUrl: String
  heroImageUrl: String
  galleryImages: [String] // Cloudinary URLs

  // Services
  services: [
    {
      _id: ObjectId
      name: String
      price: String
      description: String
      durationMinutes: Number
      isFeatured: Boolean
    }
  ]

  // Theme
  theme: {
    primaryColor: String // hex
    secondaryColor: String
    layout: Enum('classic', 'modern', 'minimal')
    fontFamily: Enum('sans', 'serif', 'display')
    darkMode: Boolean
  }

  // SEO
  seo: {
    metaTitle: String
    metaDescription: String
    ogImageUrl: String
  }

  // Stats (aggregated)
  stats: {
    totalViews: Number default 0
    totalWhatsAppClicks: Number default 0
    totalCallClicks: Number default 0
    totalLeadSubmissions: Number default 0
  }

  // Flags
  isPublished: Boolean default false
  isFeatured: Boolean default false
  isActive: Boolean default true

  createdAt: Date
  updatedAt: Date
}

5.3.3 Lead Model (models/Lead.js)

Lead {
  _id: ObjectId
  business: ObjectId (ref Business, required)
  name: String
  email: String
  phone: String
  message: String
  source: Enum('contact_form', 'cta_button') default 'contact_form'
  status: Enum('new', 'contacted', 'closed') default 'new'
  createdAt: Date
}

5.3.4 Plan Model (models/Plan.js)

Plan {
  _id: ObjectId
  name: String // 'Free', 'Pro'
  key: String // 'free', 'pro'
  priceMonthly: Number
  priceYearly: Number
  limits: {
    maxGalleryImages: Number
    maxServices: Number
    analyticsAccess: Boolean
    customDomain: Boolean
  }
  createdAt: Date
  updatedAt: Date
}

5.3.5 Event Model (models/Event.js)

Event {
  _id: ObjectId
  business: ObjectId (ref Business, required)
  type: Enum('view', 'whatsapp_click', 'call_click', 'lead_submission')
  ip: String
  userAgent: String
  createdAt: Date
}


---

5.4 Core Config Files

5.4.1 config/db.js

import mongoose

export async function connectDB():
  try:
    mongoose.connect(MONGO_URI)
    log "MongoDB connected"
  catch error:
    log error
    process.exit(1)

5.4.2 config/cloudinary.js

import cloudinary from 'cloudinary'

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
})

export cloudinary


---

5.5 Middleware

5.5.1 auth.js

function auth(requiredRole?):
  read Authorization header: "Bearer <token>"
  if no header -> 401
  verify token with JWT_ACCESS_SECRET
  if invalid -> 401
  attach { id, role } to req.user
  if requiredRole and req.user.role !== requiredRole -> 403
  next()

5.5.2 adminOnly.js

function adminOnly(req, res, next):
  if req.user.role !== 'admin':
    return 403
  next()

5.5.3 errorHandler.js

function errorHandler(err, req, res, next):
  log error
  status = err.statusCode || 500
  message = err.message || "Internal server error"
  return res.status(status).json({ message })

5.5.4 rateLimiter.js

Use express-rate-limit for sensitive routes (auth, leads).


---

5.6 API Endpoints & Pseudocode

5.6.1 Auth Routes (/api/auth)

1. POST /signup



INPUT: { name, email, password }
LOGIC:
  validate input
  if user with email exists -> 400
  hash password
  create user with role 'owner' and planKey 'free'
  generate accessToken & refreshToken
RETURN:
  { user: { id, name, email, role, planKey }, accessToken, refreshToken }

2. POST /login



INPUT: { email, password }
LOGIC:
  find user by email
  if !user or password invalid -> 401
  if !user.isActive -> 403
  generate accessToken & refreshToken
  update lastLoginAt
RETURN:
  { user, accessToken, refreshToken }

3. POST /refresh



INPUT: { refreshToken }
LOGIC:
  verify refreshToken with JWT_REFRESH_SECRET
  if invalid -> 401
  generate new accessToken
RETURN:
  { accessToken }

4. POST /logout



Optionally invalidate refresh token storage/blacklist.
RETURN: { success: true }


---

5.6.2 User Routes (/api/users)

GET /me (auth: owner/admin)

LOGIC:
  find user by req.user.id
  exclude passwordHash
RETURN:
  { user }


---

5.6.3 Business Routes (/api/businesses)

1. GET /me (auth: owner)



LOGIC:
  find business where owner == req.user.id
RETURN:
  { business or null }

2. POST / (auth: owner)



INPUT: businessData { name, tagline, description, category, contact info, theme, seo, etc. }

LOGIC:
  find business where owner == req.user.id
  if exists:
    update it
  else:
    generate slug from name
    ensure slug unique (append -1, -2, etc if needed)
    create new business with owner = req.user.id
RETURN:
  { business }

3. PUT /:id (auth: owner)



LOGIC:
  find business by id
  if business.owner != req.user.id -> 403
  update allowed fields
RETURN:
  { updatedBusiness }

4. POST /:id/publish (auth: owner)



LOGIC:
  ensure business.owner == req.user.id
  set isPublished = true
RETURN:
  { business }

5. GET /slug/:slug (public)



LOGIC:
  find business where slug == :slug and isPublished && isActive
  if not found -> 404
  increment business.stats.totalViews
  create Event { type: 'view', business, ip, userAgent }
RETURN:
  { businessPublicData }

6. POST /:id/track-cta (public)



INPUT: { type } // 'whatsapp_click' | 'call_click'
LOGIC:
  find business by id
  if type == 'whatsapp_click':
    increment stats.totalWhatsAppClicks
  else if type == 'call_click':
    increment stats.totalCallClicks
  create Event with this type
RETURN:
  { success: true }


---

5.6.4 Lead Routes (/api/leads)

1. POST / (public)



INPUT: { businessId, name, email, phone, message }
LOGIC:
  find business by id where isActive && isPublished
  if not -> 400
  create Lead
  increment business.stats.totalLeadSubmissions
  create Event { type: 'lead_submission', business }
  optionally send email (nodemailer) to business owner
RETURN:
  { leadCreated: true }

2. GET /my (auth: owner)



LOGIC:
  find business for owner (owner == req.user.id)
  find leads where business == business._id
RETURN:
  [Lead]


---

5.6.5 Analytics Routes (/api/analytics)

GET /my-business (auth: owner)

LOGIC:
  find owner’s business
  aggregate Event documents for that business over last 30 days:
    group by date and type
RETURN:
  {
    viewsByDate: [ { date, count } ],
    whatsappClicksByDate: [ { date, count } ],
    callClicksByDate: [ { date, count } ],
    leadSubmissionsByDate: [ { date, count } ],
    totals: from business.stats
  }


---

5.6.6 Admin Routes (/api/admin) (auth: admin)

GET /users – list all users (with pagination).

GET /businesses – list all businesses (with filters).

PATCH /users/:id/status – update isActive.

PATCH /businesses/:id/status – update isActive / isFeatured.


Example:

PATCH /businesses/:id/status
INPUT: { isActive?, isFeatured? }
LOGIC:
  find business by id
  update fields
RETURN:
  { business }


---

5.6.7 Payment Routes (/api/payments) – Optional Advanced

1. POST /create-checkout-session (auth: owner)



INPUT: { planKey, billingPeriod } // 'monthly' | 'yearly'
LOGIC:
  find Plan by planKey
  create Stripe/Razorpay checkout session with metadata:
    userId, planKey, billingPeriod
RETURN:
  { checkoutUrl or sessionId }

2. POST /webhook (public)



LOGIC:
  verify webhook signature
  on payment success:
    read metadata.userId and metadata.planKey
    update user.planKey = planKey
RETURN:
  200 OK


---

6. Frontend Detailed Specification

6.1 Folder Structure

frontend/
  src/
    api/
      axiosClient.js
      authApi.js
      userApi.js
      businessApi.js
      leadApi.js
      adminApi.js
      analyticsApi.js
    components/
      layout/
        Navbar.jsx
        Sidebar.jsx
        DashboardShell.jsx
      ui/
        Button.jsx
        Input.jsx
        Select.jsx
        Textarea.jsx
        Badge.jsx
        Modal.jsx
        Card.jsx
        Loader.jsx
        Tabs.jsx
      business/
        BusinessForm.jsx
        ServicesEditor.jsx
        GalleryUploader.jsx
        ThemePicker.jsx
        SeoForm.jsx
        AnalyticsCharts.jsx
        LeadsTable.jsx
      publicSite/
        PublicHero.jsx
        PublicServices.jsx
        PublicGallery.jsx
        PublicContact.jsx
    hooks/
      useAuth.js
      useBusiness.js
    pages/
      auth/
        LoginPage.jsx
        SignupPage.jsx
      dashboard/
        DashboardHome.jsx
        BusinessEditPage.jsx
        AnalyticsPage.jsx
        LeadsPage.jsx
      publicSite/
        BusinessSitePage.jsx
      admin/
        AdminDashboardPage.jsx
        AdminUsersPage.jsx
        AdminBusinessesPage.jsx
      LandingPage.jsx
      NotFoundPage.jsx
    router/
      AppRouter.jsx
    App.jsx
    main.jsx
  index.css
  tailwind.config.cjs
  postcss.config.cjs
  vite.config.js
  package.json


---

6.2 Tailwind Setup

tailwind.config.cjs:

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

index.css:

@tailwind base;
@tailwind components;
@tailwind utilities;


---

6.3 API Client (src/api/axiosClient.js)

Pseudocode:

import axios

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
})

api.interceptors.request.use(config => {
  const token = authStore.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true
      try:
        const refreshToken = authStore.refreshToken
        if (!refreshToken) throw new Error("No refresh token")
        const { data } = await axios.post("/auth/refresh", { refreshToken })
        authStore.setAccessToken(data.accessToken)
        error.config.headers.Authorization = `Bearer ${data.accessToken}`
        return api(error.config)
      } catch (err) {
        authStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

export default api


---

6.4 Auth Hook (src/hooks/useAuth.js)

Pseudocode (Zustand example):

create authStore:
  state:
    user = null
    accessToken = null
    refreshToken = null
  actions:
    initFromStorage():
      read from localStorage
      set state
    login(credentials):
      call authApi.login
      set user & tokens
      save to localStorage
    signup(data):
      call authApi.signup
      same as login
    logout():
      clear state & localStorage

Call initFromStorage() once in main.jsx or App.jsx.


---

6.5 Routing (src/router/AppRouter.jsx)

Pseudocode:

Routes:
  "/" -> LandingPage
  "/login" -> LoginPage
  "/signup" -> SignupPage

  "/dashboard" -> ProtectedRoute(DashboardHome)
  "/dashboard/business" -> ProtectedRoute(BusinessEditPage)
  "/dashboard/analytics" -> ProtectedRoute(AnalyticsPage)
  "/dashboard/leads" -> ProtectedRoute(LeadsPage)

  "/admin" -> AdminOnlyRoute(AdminDashboardPage)
  "/admin/users" -> AdminOnlyRoute(AdminUsersPage)
  "/admin/businesses" -> AdminOnlyRoute(AdminBusinessesPage)

  "/site/:slug" -> BusinessSitePage

  "*" -> NotFoundPage

ProtectedRoute logic:

if !auth.user:
  redirect to /login
else:
  render children

AdminOnlyRoute logic:

if !auth.user or auth.user.role !== 'admin':
  redirect to /dashboard
else:
  render children


---

6.6 Major Pages & Components (Pseudocode)

6.6.1 LandingPage

Shows:

Short explanation of what LocalBizSite does.

Screenshots or demo links.


Actions:

"Get Started" → /signup

"Login" → /login



6.6.2 LoginPage / SignupPage

Use react-hook-form + zod for form validation.

onSubmitLogin(formData):
  await authStore.login(formData)
  redirect to /dashboard

onSubmitSignup(formData):
  await authStore.signup(formData)
  redirect to /dashboard


---

6.6.3 DashboardHome

Fetch analytics summary using analyticsApi.getMyBusinessAnalytics.

Show cards:

"Total Views"

"Total Leads"

"WhatsApp Clicks"

"Call Clicks"


Buttons:

"Edit Website" → /dashboard/business

"View My Site" → /site/<slug>

"Leads" → /dashboard/leads

"Analytics" → /dashboard/analytics




---

6.6.4 BusinessEditPage

Uses:

BusinessForm

ServicesEditor

GalleryUploader

ThemePicker

SeoForm


Pseudocode:

state: { business, loading, error }

onMount:
  data = businessApi.getMyBusiness()
  if data:
    set business
  else:
    set business = defaultEmptyBusiness

onSave():
  prepare payload from local state
  upload any new images via backend to Cloudinary
  call businessApi.saveMyBusiness(payload)
  show success toast

onPublish():
  call businessApi.publishMyBusiness(business._id)
  show public URL


---

6.6.5 AnalyticsPage

state: { data, loading, error }

onMount:
  data = analyticsApi.getMyBusinessAnalytics()

render:
  totals cards (views, WhatsApp clicks, call clicks, leads)
  line chart of viewsByDate using recharts
  b
