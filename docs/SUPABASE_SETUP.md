# Supabase Setup Guide

## Overview
This application uses Supabase for cloud-based data storage and authentication. This guide walks through setting up a Supabase project and configuring the application.

## Prerequisites
- A Supabase account (free tier available at https://supabase.com)
- Basic understanding of SQL

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in/create account
2. Click "New Project"
3. Choose a name (e.g., "life-balance")
4. Create a strong database password
5. Select your region (closest to your users)
6. Wait for the project to initialize

## Step 2: Get Your Credentials

1. In the Supabase dashboard, go to Project Settings → API
2. Copy the following values:
   - **Project URL**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key**: `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Step 3: Set Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Anthropic
ANTHROPIC_API_KEY=your_api_key
```

## Step 4: Create Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Click "New Query"
3. Copy and paste the contents of `docs/schema.sql`
4. Click "Run"

This will create all necessary tables with proper relationships and security settings.

## Step 5: Configure Row Level Security (RLS)

The schema includes RLS policies that ensure users can only access their own data. Verify in the Supabase dashboard:

1. Go to Authentication → Policies
2. Confirm policies are set for each table:
   - `users`: Users can read/write their own data
   - `meals`: Users can only see their own meals
   - `habits`: Users can only see their own habits
   - `profiles`: Users can only see their own profile
   - `messages`: Users can only see their own conversation history

## Step 6: Test the Connection

Run the application:

```bash
npm run dev
```

The app will automatically detect Supabase and use it for data storage. If credentials are missing, it will fall back to localStorage.

## Database Schema Overview

### Users Table
- `id`: UUID (Primary Key, from Auth)
- `name`: Text
- `email`: Text (Unique)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Meals Table
- `id`: UUID
- `user_id`: UUID (FK to users)
- `name`: Text
- `type`: Enum (breakfast, snack, lunch, dinner)
- `time`: Time
- `calories`: Integer (nullable)
- `completed`: Boolean
- `notes`: Text
- `ingredients`: JSON array
- `date`: Date
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Habits Table
- `id`: UUID
- `user_id`: UUID (FK to users)
- `name`: Text
- `category`: Enum (water, exercise, sleep, nutrition, custom)
- `emoji`: Text
- `completed`: Boolean
- `streak`: Integer
- `last_completed_date`: Date
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Profiles Table
- `id`: UUID
- `user_id`: UUID (FK to users)
- `meal_times`: JSON (breakfast, lunch, dinner times)
- `daily_goals`: JSON (calorie goal, water goal, etc.)
- `dietary_restrictions`: Text[]
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Messages Table
- `id`: UUID
- `user_id`: UUID (FK to users)
- `role`: Enum (user, assistant)
- `content`: Text
- `created_at`: Timestamp

## Troubleshooting

### "Missing Supabase credentials"
- Ensure `.env.local` has correct values
- Double-check you copied the keys correctly
- Restart the dev server

### "401 Unauthorized"
- Verify your Anon Key is correct
- Check that RLS policies are properly set
- Ensure the table allows anonymous access (or configure auth)

### "CORS errors"
- Go to Supabase Settings → API → CORS Allowed Origins
- Add `http://localhost:3000` (and your production URL)

### Data not persisting
- Check browser console for errors
- Verify RLS policies aren't blocking writes
- Check that user is authenticated

## Production Deployment

Before deploying to production:

1. Update `.env.local` to `.env.production.local`
2. Set all environment variables in your hosting platform
3. Update CORS Allowed Origins in Supabase to include your production domain
4. Test full user flow in staging environment
5. Set up automated backups in Supabase

## Security Best Practices

1. **Never** commit `.env.local` to version control
2. Use `SUPABASE_SERVICE_ROLE_KEY` only on server-side
3. Keep Anon Key in environment variables, not in code
4. Regularly rotate keys in production
5. Monitor RLS policies to ensure proper access control
