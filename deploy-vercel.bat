@echo off
REM Budget Buddy - One-Click Vercel Deployment Script for Windows

echo.
echo 🚀 Budget Buddy - Vercel Deployment
echo ====================================
echo.

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

echo 🔗 Deploying to Vercel...
echo.
echo When prompted:
echo   - Are you setting up a new project? - YES
echo   - Project name? - home-budget (or your choice)
echo   - Which directory? - ./ (or press Enter)
echo.

REM Deploy
call vercel --prod

echo.
echo ✅ Deployment complete!
echo Your app is now live at the URL above.
echo Access it from your phone at the provided link.
pause
