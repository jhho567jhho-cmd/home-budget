# Budget Buddy - Deployment Guide

Your Budget Buddy application is fully built and ready to deploy! Here are the options:

## Option 1: Deploy to Vercel (Recommended - Easiest)

1. **Clone to your local machine:**
   ```bash
   git clone https://github.com/jhho567jhho-cmd/home-budget.git
   cd home-budget
   ```

2. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```
   
   During deployment, Vercel will ask you:
   - Are you setting up a new project? → **Yes**
   - Project name? → `home-budget` (or your choice)
   - Which directory contains your code? → **./**.
   - Vercel will auto-detect this as a Next.js project
   
4. **Access your live app:** Vercel will provide a URL like `https://home-budget-xxxxx.vercel.app`

## Option 2: Deploy to Railway.app

1. **Sign up** at https://railway.app
2. **Connect your GitHub** repository
3. **Create a new project** and link it to the `home-budget` repository
4. Railway auto-detects Next.js and deploys automatically
5. Your app will be live at a Railway-provided URL

## Option 3: Deploy to Render.com

1. **Sign up** at https://render.com
2. **Create new Web Service**
3. **Connect GitHub** and select `home-budget` repository
4. **Build Command:** `npm run build`
5. **Start Command:** `npm start`
6. Deploy and access your live app

## Option 4: Run Locally & Access from Phone (Current Setup)

Your app is currently running on `http://localhost:3000`

**To access from your phone on the same network:**
1. Find your computer's local IP address:
   - **Windows:** Open CMD, type `ipconfig` and find IPv4 Address (e.g., 192.168.1.100)
   - **Mac/Linux:** Open Terminal, type `ifconfig` and find inet address
   
2. **On your phone** (connected to same WiFi), open:
   ```
   http://[YOUR_IP]:3000
   ```
   Example: `http://192.168.1.100:3000`

## Testing the App

Once deployed or running locally, test with:
- Input in Hebrew: "קניתי לחם ב-12 שקל" (I bought bread for 12 shekels)
- Input in Hebrew: "נסעתי בטקסי 50 שקל" (I took a taxi for 50 shekels)
- Voice input: Click the 🎤 button and speak in Hebrew

## Features Ready to Use

✅ Hebrew natural language expense tracking
✅ Automatic category detection
✅ Real-time analytics and recurring patterns
✅ Budget alerts and savings suggestions
✅ AI coaching with spending scores
✅ Data export (JSON, CSV)
✅ Voice input in Hebrew
✅ Complete dark theme UI

## Troubleshooting

**Phone can't connect?**
- Make sure phone is on same WiFi network as computer
- Check firewall isn't blocking port 3000
- Use your computer's local IP address (not localhost)

**Build fails locally?**
```bash
npm install  # Install dependencies
npm run build  # Build the app
npm start  # Start the app
```

Enjoy your Budget Buddy app! 🚀💰
