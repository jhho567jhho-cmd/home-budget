#!/bin/bash
# Budget Buddy - One-Click Vercel Deployment Script

echo "🚀 Budget Buddy - Vercel Deployment"
echo "===================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔗 Deploying to Vercel..."
echo ""
echo "When prompted:"
echo "  - Are you setting up a new project? → YES"
echo "  - Project name? → home-budget (or your choice)"
echo "  - Which directory? → ./ (or press Enter)"
echo ""

# Deploy
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Your app is now live at the URL above."
echo "Access it from your phone at the provided link."
