# 🚀 MockForge - Complete Setup & Testing Guide

## 📊 Current Status

### ✅ What's Already Done:
1. **Frontend Code** - Complete with all features
2. **Backend Code** - Complete with all APIs
3. **Database Models** - User, Project, OTP schemas ready
4. **API Routes** - All endpoints configured
5. **Authentication** - JWT + OTP system ready
6. **Email Service** - Google SMTP configured
7. **Environment Files** - Templates created

### ⚠️ What You Need to Do:
1. **Install Backend Dependencies** - `cd backend && npm install`
2. **Setup MongoDB** - Local or Atlas
3. **Configure Environment** - Add your credentials
4. **Start Backend Server** - `npm run dev`
5. **Start Frontend Server** - `npm run dev`
6. **Test Complete Flow** - Signup → Login → Create Project → Save

---

## 🎯 Step-by-Step Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This will install:
- express (web server)
- mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- nodemailer (email sending)
- cors (cross-origin)
- dotenv (environment variables)
- helmet (security)
- express-rate-limit (rate limiting)
- nodemon (auto-restart)

### Step 2: Setup MongoDB

**Option A: Local MongoDB (Easiest)**

1. Install MongoDB Community Server:
   - Windows: https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow MongoDB docs

2. Start MongoDB:
   ```bash
   # Windows
   net start MongoDB
   
   # Mac
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. MongoDB will run on: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended for Production)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Create database user
5. Allow access from anywhere (0.0.0.0/0)
6. Get connection string
7. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mockforge
   ```

### Step 3: Configure Backend Environment

Edit `backend/.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB (use local or Atlas)
MONGODB_URI=mongodb://localhost:27017/mockforge
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mockforge

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

# Google SMTP (for email verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_google_app_password
SMTP_FROM_NAME=MockForge
SMTP_FROM_EMAIL=noreply@mockforge.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OTP
OTP_LENGTH=6
OTP_EXPIRE_MINUTES=10
```

**How to Get Google App Password:**
1. Go to https://myaccount.google.com/
2. Enable 2-Step Verification
3. Go to Security → App Passwords
4. Generate password for "Mail"
5. Copy 16-character password (no spaces)
6. Use in `SMTP_PASS`

### Step 4: Configure Frontend Environment

Edit `.env` file (frontend root):

```env
VITE_API_URL=http://localhost:5000/api
```

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 MockForge Backend Server                             ║
║                                                           ║
║   ✅ Server running on port 5000                          ║
║   📡 Environment: development                             ║
║   🔗 API: http://localhost:5000/api                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

✅ MongoDB Connected: localhost
```

### Step 6: Start Frontend Server

In a new terminal:

```bash
npm run dev
```

You should see:
```
VITE ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Step 7: Test Complete Flow

1. **Visit**: http://localhost:5173
2. **Sign Up**: Create new account
3. **Verify Email**: Check email for OTP (or check backend console)
4. **Login**: Login with your credentials
5. **Create Project**: Click "Create New Project"
6. **Edit Project**: Add devices, screenshots, etc.
7. **Save Project**: Click save button
8. **Check Database**: Verify data is saved in MongoDB

---

## 🔍 How to Verify Data is Saved in MongoDB

### Method 1: Using MongoDB Compass (GUI)

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `mockforge`
4. Check collections:
   - `users` - Your user data
   - `projects` - Your project data
   - `otps` - OTP records

### Method 2: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to database
use mockforge

# Show all users
db.users.find()

# Show all projects
db.projects.find()

# Show all OTPs
db.otps.find()

# Count documents
db.users.countDocuments()
db.projects.countDocuments()
```

### Method 3: Using Backend API

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Get projects (use token from login response)
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Method 4: Check Backend Console

When you save a project, you'll see in backend console:
```
PUT /api/projects/PROJECT_ID
```

This means the API is being called and data is being saved.

---

## 🎨 UI Indicators for Database Save

### In Frontend:

1. **Save Button**: Shows "Saving..." while saving
2. **Toast Notification**: Shows "Project saved" on success
3. **Status Indicator**: Shows "saved" or "unsaved" in header
4. **Dashboard**: Shows all your projects from database
5. **Auto-save**: Saves automatically every few seconds

### In Backend Console:

You'll see API calls:
```
POST /api/projects          - Create project
PUT /api/projects/:id       - Update project
GET /api/projects           - Get all projects
DELETE /api/projects/:id    - Delete project
```

---

## 🧪 Testing Checklist

### Authentication Flow:
- [ ] Sign up works
- [ ] Email verification works
- [ ] Login works
- [ ] Logout works
- [ ] Password reset works

### Project Flow:
- [ ] Create project works
- [ ] Project saves to database
- [ ] Project loads from database
- [ ] Project updates work
- [ ] Project deletes work
- [ ] Project duplicates work

### Data Persistence:
- [ ] Refresh page → Data still there
- [ ] Logout and login → Data still there
- [ ] Close browser → Data still there
- [ ] Different device → Data syncs (if deployed)

---

## 🐛 Troubleshooting

### Backend Not Starting:
```bash
# Check if MongoDB is running
mongosh

# Check if port 5000 is in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Kill process on port 5000
kill -9 PID  # Replace PID with actual process ID
```

### MongoDB Connection Failed:
```bash
# Check MongoDB is running
# Windows:
net start MongoDB

# Mac:
brew services list

# Linux:
sudo systemctl status mongod
```

### Frontend Can't Connect to Backend:
```bash
# Check backend is running on port 5000
curl http://localhost:5000/api/health

# Check CORS settings in backend/server.js
# Check VITE_API_URL in .env
```

### Email Not Sending:
```bash
# Check Google App Password is correct
# Check 2FA is enabled on Google account
# Check backend console for errors
# Check spam folder
```

---

## 📊 Database Schema

### Users Collection:
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  emailVerified: Boolean,
  avatar: String,
  createdAt: Date,
  lastLogin: Date
}
```

### Projects Collection:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  name: String,
  type: String,
  canvas: { w: Number, h: Number },
  assets: Array,
  devices: Array,
  background: Object,
  text: Object,
  logo: Object,
  decoration: Object,
  accents: Object,
  thumbnail: String,
  exportCount: Number,
  decos: Array,
  mood: String,
  icons: Array,
  textboxes: Array,
  canvasImages: Array,
  createdAt: Date,
  updatedAt: Date
}
```

### OTPs Collection:
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  otp: String,
  type: String (email-verification | password-reset),
  expiresAt: Date (auto-deletes after expiry),
  attempts: Number,
  createdAt: Date
}
```

---

## 🚀 Quick Start Commands

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Start MongoDB (if local)
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# 3. Start backend server
npm run dev

# 4. In new terminal, start frontend
cd ..
npm run dev

# 5. Visit http://localhost:5173
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend console shows "MongoDB Connected"
2. ✅ Frontend loads without errors
3. ✅ Can sign up and receive OTP email
4. ✅ Can login successfully
5. ✅ Can create project
6. ✅ Can save project (see "Project saved" toast)
7. ✅ Can see project in dashboard after refresh
8. ✅ Can see data in MongoDB Compass/Shell
9. ✅ Backend console shows API calls (PUT /api/projects/:id)

---

## 📞 Need Help?

1. Check backend console for errors
2. Check browser console (F12) for errors
3. Check MongoDB is running
4. Check environment variables are correct
5. Check API URL in frontend .env

---

**Ready to test? Follow the steps above and let me know if you face any issues!** 🚀
