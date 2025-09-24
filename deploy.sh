#!/bin/bash

echo "🚀 PropFirm Copier - Vercel Deployment Script"
echo "=============================================="

# Add all files to git
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy PropFirm Copier to Vercel - $(date)"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🔗 Next steps:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Import your GitHub repository"
echo "4. Add environment variables (see VERCEL_DEPLOYMENT.md)"
echo "5. Deploy!"
echo ""
echo "📋 Required Environment Variables:"
echo "- DATABASE_URL"
echo "- NEXTAUTH_URL (https://your-app-name.vercel.app)"
echo "- NEXTAUTH_SECRET"
echo "- GOOGLE_CLIENT_ID"
echo "- GOOGLE_CLIENT_SECRET"
echo ""
echo "📖 Full guide: See VERCEL_DEPLOYMENT.md"
