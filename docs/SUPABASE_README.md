# Supabase Integration Overview

This document provides a comprehensive overview of the Supabase integration in LifeBalance.

## 📋 What is Supabase?

Supabase is an open-source Firebase alternative that provides:
- **PostgreSQL Database** - Powerful, reliable SQL database
- **Authentication** - User signup/login management
- **Real-time** - Live data synchronization
- **REST API** - Easy-to-use HTTP endpoints
- **Row Level Security** - Automatic data isolation

## 🎯 Why Supabase?

### Without Supabase (localStorage)
```
User A (Browser)           User A (Mobile)
     ↓                           ↓
[localStorage]             [localStorage]
     ↓                           ↓
   Data                        No Data
(isolated)                   (different device)
```

Problems:
- ❌ Data only on one device
- ❌ Data lost if cache cleared
- ❌ No backup
- ❌ No multi-device sync

### With Supabase (Cloud)
```
User A (Browser)  User A (Mobile)  User A (Tablet)
     ↓                  ↓                  ↓
     └──────────────────┴──────────────────┘
                    ↓
            ☁️ Supabase Cloud ☁️
                    ↓
            [PostgreSQL DB]
```

Benefits:
- ✅ Data accessible from any device
- ✅ Automatic backups
- ✅ Real-time synchronization
- ✅ Secure with Row Level Security
- ✅ Scalable to millions of users

## 🚀 Quick Start

### 1. Create Supabase Project (5 min)
```bash
# Visit https://supabase.com
# Click "New Project"
# Fill in project details
# Wait for initialization
```

### 2. Get Credentials (2 min)
```
Project Settings → API:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Add to .env.local (1 min)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 4. Create Schema (2 min)
```bash
# In Supabase SQL Editor:
# Copy & paste contents of docs/schema.sql
# Click Run
```

### 5. Test (1 min)
```bash
npm run dev
# Add a meal
# Check Supabase dashboard → meals table
```

**Total time: ~15 minutes**

See `docs/QUICK_START_SUPABASE.md` for detailed instructions.

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START_SUPABASE.md` | 5-minute setup guide |
| `SUPABASE_SETUP.md` | Complete setup with troubleshooting |
| `MIGRATION_GUIDE.md` | How to migrate from localStorage |
| `TESTING_GUIDE.md` | How to verify everything works |
| `schema.sql` | Database schema (SQL) |

## 🏗️ Architecture

### Data Storage

```
LifeBalance App
    ↓
Supabase Client Library
    ├─ Automatic fallback to localStorage
    └─ All CRUD operations
    
Contexts (React)
├─ AuthContext - User login/logout
├─ MealsContext - Meal data
├─ HabitsContext - Habit tracking
├─ ProfileContext - User settings
└─ ConversationContext - Chat history
```

### Database Schema

```sql
users
├─ id (UUID, from Supabase Auth)
├─ name (Text)
├─ email (Text)
└─ timestamps

meals
├─ id, user_id (Foreign Key)
├─ name, type, time, calories
├─ completed, notes, ingredients
├─ date
└─ timestamps

habits
├─ id, user_id (Foreign Key)
├─ name, category, emoji
├─ completed, streak
├─ timestamps

profiles
├─ id, user_id (Foreign Key, Unique)
├─ meal_times (JSON)
├─ daily_goals (JSON)
├─ dietary_restrictions (Array)
└─ timestamps

messages
├─ id, user_id (Foreign Key)
├─ role ('user' | 'assistant')
├─ content (Text)
└─ created_at
```

All tables have **Row Level Security (RLS)** enabled so users only see their own data.

## 🔄 How It Works

### Automatic Fallback

The app automatically detects Supabase credentials:

```typescript
if (NEXT_PUBLIC_SUPABASE_URL && NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  // Use Supabase for all operations
} else {
  // Fall back to localStorage
}
```

### Data Flow Example: Adding a Meal

**With Supabase:**
```
User clicks "Add Meal"
         ↓
React state updated
         ↓
MealsContext.addMeal() called
         ↓
supabase.from('meals').insert({...})
         ↓
Data sent to Supabase
         ↓
Supabase stores in database
         ↓
RLS policy validates user owns data
         ↓
Response returned
         ↓
UI updates with new meal
```

**Without Supabase:**
```
User clicks "Add Meal"
         ↓
React state updated
         ↓
MealsContext.addMeal() called
         ↓
localStorage.setItem(key, data)
         ↓
Data stored in browser
         ↓
UI updates immediately
```

## 🔐 Security

### Row Level Security (RLS)

Each table has policies that ensure:
- Users can only SELECT their own rows
- Users can only INSERT rows for themselves
- Users can only UPDATE their own rows
- Users can only DELETE their own rows

Example policy:
```sql
CREATE POLICY "Users can read own meals"
  ON meals FOR SELECT
  USING (auth.uid() = user_id);
```

This means:
- ✅ User A cannot see User B's meals
- ✅ Even if User A has database access
- ✅ Database enforces this automatically

### API Keys

- **Anon Key:** Public, embedded in app, read/write only own data (safe to expose)
- **Service Role Key:** Secret, server-side only, admin access (never expose)

Never put Service Role Key in frontend code or .env files that are committed!

## 📊 Monitoring

### Check Data in Dashboard

1. Open Supabase Dashboard
2. Click "Database"
3. Click "Meals" (or other table)
4. View all records

### Monitor Real-time Activity

1. Click "Database" → "Realtime"
2. See all changes as they happen
3. Useful for debugging multi-device sync

### View API Logs

1. Click "Logs" → "API"
2. See all API requests
3. Check for errors

## 🧪 Testing

Full testing guide available at `docs/TESTING_GUIDE.md`

Quick test:
```bash
# 1. Set Supabase credentials in .env.local
# 2. Run app
npm run dev

# 3. Add a meal
# 4. Check Supabase dashboard → meals table
# 5. Should see the meal in database
```

## 🆘 Troubleshooting

### Issue: "Supabase credentials missing" warning

**Cause:** Missing or invalid .env.local
**Fix:**
```bash
# Create .env.local with:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Restart app
npm run dev
```

### Issue: 401 Unauthorized errors

**Cause:** Wrong Anon Key
**Fix:**
1. Go to Supabase Settings → API
2. Copy correct Anon Key
3. Update .env.local
4. Restart app

### Issue: CORS errors

**Cause:** Request origin not allowed
**Fix:**
1. Go to Supabase Settings → API → CORS
2. Add `http://localhost:3000`
3. For production, add your domain
4. Save and wait ~1 minute

### Issue: Data not saving

**Cause:** RLS policy blocking writes
**Fix:**
1. Check Supabase Dashboard → Authentication → Users
2. Verify user is signed up
3. Check RLS policies in Database → Policies
4. Verify auth.uid() matches user_id in table

See `docs/SUPABASE_SETUP.md` for more troubleshooting.

## 🚀 Deployment

### Production Setup

1. **Create Supabase project for production**
   - Separate from development
   - Run schema.sql in production database

2. **Set environment variables in hosting platform**
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ANTHROPIC_API_KEY=...
   ```

3. **Update CORS settings**
   ```
   Supabase Settings → API → CORS Allowed Origins
   Add: https://yourdomain.com
   ```

4. **Set up automated backups**
   ```
   Supabase Settings → Backups
   Enable daily backups
   ```

5. **Monitor usage**
   ```
   Supabase Dashboard → Logs
   Watch for errors and performance issues
   ```

## 💾 Backups

### Automatic Backups
- ✅ Supabase automatically backs up daily
- ✅ Free tier keeps backups for 7 days
- ✅ Paid tier keeps backups for 30 days

### Manual Backups
```sql
-- Export all data as SQL
-- In Supabase SQL Editor, select all and copy
SELECT * FROM meals;
SELECT * FROM habits;
```

### Restore from Backup
1. Supabase Dashboard → Settings → Backups
2. Choose date to restore
3. Click restore
4. Data reverts to that point in time

## 📈 Scaling

### Free Tier Limits
- 500 MB database storage
- 2 GB bandwidth/month
- 50,000 concurrent connections
- No RLS limits

Sufficient for:
- Hundreds of users
- Years of data
- Most personal apps

### If You Outgrow Free Tier
1. Upgrade to Pro ($25/month)
2. Get more storage and bandwidth
3. Priority support
4. Custom domains

## 🔄 Migration from Firebase

If migrating from Firebase:

```
Firebase Realtime DB    Firebase Auth
        ↓                   ↓
   [JSON Tree]      [Email/Password]
        ↓                   ↓
        └────────┬──────────┘
                 ↓
          Supabase (similar)
        ↓              ↓
    [SQL Tables]  [Email/Password]
        ↓              ↓
    PostgreSQL    Built-in Auth
```

Supabase is more powerful than Firebase for structured data.

## 🎓 Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 📞 Support

- **Supabase Issues:** https://github.com/supabase/supabase/issues
- **Docs:** https://supabase.com/docs
- **Community:** https://discord.supabase.io
- **Status:** https://status.supabase.com

## ✨ Future Enhancements

Possible improvements:
- [ ] Real-time sync using WebSockets
- [ ] Offline support with sync
- [ ] Data export/import from CSV
- [ ] Advanced analytics
- [ ] Role-based access control
- [ ] Automated data cleanup
- [ ] Performance optimization queries

---

**Next Steps:**
1. Read `docs/QUICK_START_SUPABASE.md`
2. Set up Supabase project
3. Add environment variables
4. Run schema.sql
5. Test in app
6. See `docs/TESTING_GUIDE.md` for verification

**Questions?** Check the full setup guide: `docs/SUPABASE_SETUP.md`
