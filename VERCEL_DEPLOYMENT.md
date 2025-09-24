# 🚀 Vercel Deployment Guide

## Step 1: Prepare for Deployment

### Install Vercel CLI (if not already installed)
```bash
npm i -g vercel
```

### Login to Vercel
```bash
vercel login
```

## Step 2: Set Up Database

### Option A: Vercel Postgres (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create new project → Add Database → Postgres
3. Copy the connection string

### Option B: External PostgreSQL
Use any PostgreSQL provider (Supabase, Railway, etc.)

## Step 3: Set Up Google OAuth

### Create Production OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. **Important**: Add your Vercel domain to authorized origins:
   - `https://your-app-name.vercel.app`
   - `https://your-app-name.vercel.app/api/auth/callback/google`

## Step 4: Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**:
   In Vercel dashboard → Settings → Environment Variables, add:

```
DATABASE_URL = postgresql://username:password@host:5432/propfirm_copier
NEXTAUTH_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = your-32-character-secret-key
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
```

4. **Deploy**: Click "Deploy" - Vercel will build and deploy automatically

### Method 2: Direct CLI Deployment

```bash
# From your project directory
vercel

# Follow the prompts:
# ? Set up and deploy "propfirm_copier"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? propfirm-copier
# ? In which directory is your code located? ./
```

## Step 5: Configure Environment Variables

### Add via CLI:
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

### Add via Dashboard:
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add each variable for Production, Preview, and Development

## Step 6: Run Database Migrations

### After deployment, run migrations:
```bash
# Install dependencies locally if not done
npm install

# Generate migration files
npm run db:generate

# Run migrations against production database
npm run db:migrate
```

## Step 7: Verify Deployment

### Check these URLs work:
- `https://your-app-name.vercel.app` - Landing page
- `https://your-app-name.vercel.app/blog` - Blog section
- `https://your-app-name.vercel.app/blog/tools` - Free tools
- `https://your-app-name.vercel.app/api/auth/signin` - Auth endpoint

### Test Authentication:
1. Click "Sign In" on landing page
2. Complete Google OAuth flow
3. Should redirect to dashboard

## Step 8: Domain Configuration (Optional)

### Add Custom Domain:
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable
4. Update Google OAuth authorized origins

## 🔧 Troubleshooting

### Common Issues:

#### 1. Database Connection Error
- Check `DATABASE_URL` format
- Ensure database is accessible from Vercel
- Verify connection string includes SSL parameters if required

#### 2. OAuth Redirect Error
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Check Google OAuth authorized origins include your domain
- Ensure callback URL is correct: `https://your-domain.com/api/auth/callback/google`

#### 3. Build Errors
- Check all dependencies are in `package.json`
- Verify TypeScript types are correct
- Check for missing environment variables

#### 4. API Route Timeouts
- Vercel has 10s timeout for Hobby plan, 30s for Pro
- Optimize database queries
- Add connection pooling

## 📋 Pre-Deployment Checklist

- ✅ Database set up and accessible
- ✅ Google OAuth credentials created
- ✅ Environment variables configured
- ✅ Repository pushed to GitHub
- ✅ Vercel project created
- ✅ Domain configured (if using custom domain)

## 🚀 Quick Deploy Commands

```bash
# 1. Commit and push
git add .
git commit -m "Deploy to Vercel"
git push origin main

# 2. Deploy via CLI (alternative)
vercel --prod

# 3. Check deployment
vercel ls
```

## 📊 Post-Deployment

### Monitor your app:
- Vercel Dashboard → Analytics
- Check function logs for errors
- Monitor database connections
- Test all features work in production

### Add monitoring (optional):
- Set up Vercel Analytics
- Configure error tracking
- Monitor API response times

Your PropFirm Copier app will be live at: `https://your-app-name.vercel.app` 🎉
