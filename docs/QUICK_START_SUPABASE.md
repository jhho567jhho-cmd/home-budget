# Supabase Quick Start Guide

## 📋 Quick Setup (5 minutes)

### Step 1: Create Supabase Project
1. Visit https://supabase.com
2. Click "New Project"
3. Name it "life-balance" or similar
4. Create a strong password
5. Select your region
6. Wait for initialization (2-3 minutes)

### Step 2: Copy Your Credentials
In Supabase Dashboard → Settings → API:

```
Project URL: NEXT_PUBLIC_SUPABASE_URL
Anon Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Service Role Key: SUPABASE_SERVICE_ROLE_KEY
```

### Step 3: Set Environment Variables
Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
ANTHROPIC_API_KEY=sk-ant-...
```

### Step 4: Create Database Schema
1. In Supabase → SQL Editor
2. Click "New Query"
3. Open `docs/schema.sql`
4. Copy entire content
5. Paste in Supabase query editor
6. Click "Run"

### Step 5: Test Connection
```bash
npm run dev
```

If Supabase is configured correctly, you'll see no warning messages in the console.

## 🔍 Verify Setup

Check that all tables exist:
1. Go to Supabase → Database → Tables
2. You should see:
   - `users`
   - `meals`
   - `habits`
   - `profiles`
   - `messages`

## 🚀 Data Flow

**Without Supabase:**
- User data stored in browser localStorage
- Only works on one device
- Data lost if cache cleared

**With Supabase:**
- User data stored in cloud
- Access from any device
- Automatic backups
- Real-time sync (when using subscriptions)

## 🔒 Security Notes

- Anon Key is safe to expose (public, read/write only own data)
- Service Role Key is secret (never expose, server-side only)
- RLS policies automatically restrict data access
- Each user can only see their own data

## ❓ Troubleshooting

### "Supabase credentials missing" warning
→ `.env.local` not found or variables are empty. App will use localStorage fallback.

### 401 Unauthorized errors
→ Check that Anon Key is correct in `.env.local`

### CORS errors
→ Add `http://localhost:3000` to Supabase Settings → API → CORS Allowed Origins

### Tables not appearing
→ Verify schema.sql ran successfully in SQL Editor

## 📚 Next Steps

1. ✅ Create Supabase project
2. ✅ Set environment variables
3. ✅ Run schema.sql
4. ✅ Test on app
5. 📖 Read full guide: `docs/SUPABASE_SETUP.md`

## 💡 Pro Tips

- Use Supabase's built-in explorer to test queries
- Monitor real-time activity in Dashboard → Database → Realtime
- Set up backups in Settings → Backups
- Use Row Level Security to control data access
