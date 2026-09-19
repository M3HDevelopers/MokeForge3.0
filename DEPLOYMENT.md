# MockForge - Deployment Guide

## 🚀 Complete Deployment Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- Vercel account (free)
- Google Account (for SMTP)

---

## 📦 Step 1: MongoDB Setup (MongoDB Atlas)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for free account
3. Create a new cluster (M0 Free tier is sufficient)
4. Wait for cluster to be ready (2-3 minutes)

### 1.2 Create Database User
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Username: `mockforge_user`
4. Password: Generate strong password (save it!)
5. Role: "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string (looks like):
   ```
   mongodb+srv://mockforge_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. This is your `MONGODB_URI`

---

## 📧 Step 2: Google SMTP Setup

### 2.1 Enable 2-Step Verification
1. Go to [Google Account](https://myaccount.google.com/)
2. Click "Security" in left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow setup instructions
5. Enable 2-Step Verification

### 2.2 Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. Under "Select app", choose "Mail"
4. Under "Select device", choose "Other (Custom name)"
5. Enter name: `MockForge Backend`
6. Click "Generate"
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
8. Remove spaces: `abcdefghijklmnop`
9. This is your `SMTP_PASS`

---

## 🔧 Step 3: Backend Configuration

### 3.1 Install Dependencies
```bash
cd backend
npm install
```

### 3.2 Configure Environment Variables
Create `backend/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration (from Step 1.4)
MONGODB_URI=mongodb+srv://mockforge_user:your_password@cluster0.xxxxx.mongodb.net/mockforge

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters_long
JWT_EXPIRE=7d

# Google SMTP Configuration (from Step 2.2)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_FROM_NAME=MockForge
SMTP_FROM_EMAIL=noreply@mockforge.com

# Frontend URL (will be your Vercel frontend URL)
FRONTEND_URL=https://your-frontend.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# OTP Configuration
OTP_LENGTH=6
OTP_EXPIRE_MINUTES=10
```

### 3.3 Test Backend Locally
```bash
npm run dev
```
You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

---

## 🌐 Step 4: Deploy Backend to Vercel

### 4.1 Push to GitHub
```bash
# From project root
git init
git add .
git commit -m "Initial commit - MockForge with backend"
git branch -M main
git remote add origin https://github.com/yourusername/mockforge.git
git push -u origin main
```

### 4.2 Deploy Backend
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select `backend` folder as root directory
5. Framework Preset: "Other"
6. Build Command: Leave empty
7. Output Directory: Leave empty
8. Click "Environment Variables"
9. Add all variables from `backend/.env`:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_FROM_NAME`
   - `SMTP_FROM_EMAIL`
   - `FRONTEND_URL` (will be your frontend Vercel URL)
   - `NODE_ENV` = production
   - `PORT` = 5000
10. Click "Deploy"
11. Wait for deployment (2-3 minutes)
12. Copy your backend URL (e.g., `https://mockforge-backend.vercel.app`)

### 4.3 Test Backend API
Visit: `https://mockforge-backend.vercel.app/api/health`
Should return:
```json
{
  "status": "ok",
  "message": "MockForge API is running",
  "timestamp": "..."
}
```

---

## 🎨 Step 5: Deploy Frontend to Vercel

### 5.1 Configure Frontend Environment
Create `.env` file in project root:

```env
VITE_API_URL=https://mockforge-backend.vercel.app/api
```

### 5.2 Deploy Frontend
1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository (same repo)
4. Root Directory: "./" (project root)
5. Framework Preset: "Vite"
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Click "Environment Variables"
9. Add:
   - `VITE_API_URL` = `https://mockforge-backend.vercel.app/api`
10. Click "Deploy"
11. Wait for deployment (2-3 minutes)
12. Copy your frontend URL (e.g., `https://mockforge.vercel.app`)

### 5.3 Update Backend CORS
1. Go to Vercel backend project
2. Click "Settings" → "Environment Variables"
3. Update `FRONTEND_URL` to your frontend URL
4. Redeploy backend

---

## ✅ Step 6: Final Testing

### 6.1 Test Complete Flow
1. Visit your frontend URL
2. Click "Sign Up"
3. Create account
4. Check email for OTP
5. Verify email
6. Login
7. Create project
8. Test editor features

### 6.2 Test Email Delivery
1. Sign up with new account
2. Check if OTP email arrives
3. If not, check:
   - SMTP credentials are correct
   - App password is valid
   - Check spam folder
   - Check Vercel backend logs

---

## 🔍 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if URI is correct
echo $MONGODB_URI

# Test connection locally
cd backend
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### SMTP Issues
- Verify app password is correct (no spaces)
- Check Gmail account has 2FA enabled
- Try sending test email manually
- Check Vercel logs for errors

### CORS Issues
- Ensure `FRONTEND_URL` matches exactly (including https://)
- Check backend logs for CORS errors
- Verify allowed origins in `server.js`

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 📊 Monitoring

### Vercel Dashboard
- Backend: Check logs for API errors
- Frontend: Check deployment status
- Both: Monitor bandwidth and function invocations

### MongoDB Atlas
- Check cluster performance
- Monitor connection count
- Review slow queries

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is at least 32 characters
- [ ] MongoDB password is strong
- [ ] SMTP app password is secure
- [ ] Environment variables are not committed to Git
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced (Vercel does this automatically)

---

## 🎯 Production URLs

After deployment, you'll have:

- **Frontend**: `https://mockforge.vercel.app`
- **Backend API**: `https://mockforge-backend.vercel.app`
- **API Health**: `https://mockforge-backend.vercel.app/api/health`

---

## 📝 Custom Domain (Optional)

### Frontend Custom Domain
1. Vercel → Settings → Domains
2. Add your domain
3. Follow DNS instructions

### Backend Custom Domain
1. Vercel → Settings → Domains
2. Add subdomain (e.g., `api.mockforge.com`)
3. Update `VITE_API_URL` in frontend
4. Redeploy frontend

---

## 🚀 Quick Start Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (separate terminal)
npm install
npm run dev

# Build for production
npm run build
```

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check MongoDB Atlas connection status
3. Verify environment variables
4. Test API endpoints directly
5. Check browser console for errors

---

**Your MockForge app is now production-ready!** 🎉
