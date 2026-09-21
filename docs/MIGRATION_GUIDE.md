# Data Migration Guide: LocalStorage → Supabase

If you've been using LifeBalance with localStorage and want to migrate to Supabase, this guide explains how to do it safely.

## Current Situation

### LocalStorage (Current)
Your data is stored in your browser:
- **Location:** Browser's local storage (not synced anywhere)
- **Visibility:** Only you, only on this browser
- **Persistence:** Data lost if browser cache is cleared
- **Multi-device:** Data NOT synced to other devices
- **Backup:** No automatic backup

### Supabase (New)
Your data would be in the cloud:
- **Location:** Supabase cloud servers
- **Visibility:** Only you, any device with login
- **Persistence:** Automatic backups, data always safe
- **Multi-device:** Automatic sync across all devices
- **Backup:** Daily automatic backups

## Migration Path

### Option 1: Fresh Start with Supabase (Recommended)
If you don't have much data:

1. **Note down your current data** (take screenshots, notes)
2. **Set up Supabase** (follow `QUICK_START_SUPABASE.md`)
3. **Logout** of the app
4. **Re-enter your data** manually into Supabase
5. **Verify** data is in Supabase dashboard

**Pros:** Clean start, proper data types
**Cons:** Manual re-entry of data
**Time:** 15-30 minutes depending on data volume

### Option 2: Keep Using LocalStorage
Continue using the app as-is:

1. Don't set Supabase environment variables
2. App will use localStorage automatically
3. Your existing data continues to work
4. Can migrate later anytime

**Pros:** No work required right now
**Cons:** Data only on one device, no backup
**When to migrate:** When you need multi-device access

### Option 3: Automatic Migration (Coming Soon)
A migration tool could:
1. Read all data from localStorage
2. Upload to Supabase automatically
3. Map old data to new schema
4. Verify data integrity

**Status:** Not yet implemented
**Effort:** Medium complexity

## Current Data Structure in LocalStorage

### Where Your Data Lives

```javascript
// Your user account
localStorage.getItem('app-user')
// {
//   id: "user-xxxxx",
//   name: "Your Name",
//   createdAt: "2024-01-01T12:00:00Z"
// }

// Today's meals
localStorage.getItem('meals-user-xxxxx-2024-01-01')
// {
//   date: "2024-01-01",
//   meals: [{...}, {...}]
// }

// Today's habits
localStorage.getItem('habits-user-xxxxx-2024-01-01')
// {
//   date: "2024-01-01",
//   habits: [{...}, {...}]
// }

// Your profile settings
localStorage.getItem('profile-user-xxxxx')
// {
//   name: "Your Name",
//   preferences: {...}
// }

// Conversation history
localStorage.getItem('conversation-user-xxxxx')
// [{id: "...", role: "user", content: "..."}, ...]
```

## Step-by-Step Migration Guide

### Step 1: Export Your Current Data

Open browser DevTools (F12), go to Console, run:

```javascript
// Export all your data
const userData = {
  user: JSON.parse(localStorage.getItem('app-user')),
  meals: {},
  habits: localStorage.getItem('habits-' + JSON.parse(localStorage.getItem('app-user')).id + '-' + new Date().toISOString().split('T')[0]) ? JSON.parse(localStorage.getItem('habits-' + JSON.parse(localStorage.getItem('app-user')).id + '-' + new Date().toISOString().split('T')[0])) : null,
  profile: JSON.parse(localStorage.getItem('profile-' + JSON.parse(localStorage.getItem('app-user')).id)),
  messages: JSON.parse(localStorage.getItem('conversation-' + JSON.parse(localStorage.getItem('app-user')).id))
};

// Copy to clipboard
copy(JSON.stringify(userData, null, 2));

// Now paste into a text file and save it
```

### Step 2: Set Up Supabase

Follow the Quick Start Guide:
```bash
# See: docs/QUICK_START_SUPABASE.md
```

After setup, your `.env.local` should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 3: Test Supabase Connection

1. Restart the app: `npm run dev`
2. Check browser console - should NOT show "Supabase credentials missing"
3. Login with your name
4. Try adding a meal
5. Check Supabase Dashboard → meals table - meal should appear

### Step 4: Migrate Meals

**Manual approach:**
1. View your exported meals data
2. Go to Meals screen in app
3. Re-add each meal one by one
4. Or, import from CSV if you exported that way

**Or use export/import:**
1. Old app: Use "Export as CSV"
2. Save the CSV file
3. Manually re-add meals (CSV import not yet implemented)

### Step 5: Migrate Habits

Your default 4 habits are:
- 💧 شتיית מים (Water)
- 🏃 פעילות גופנית (Exercise)
- 😴 שינה (Sleep)
- 🥗 תזונה בריאה (Nutrition)

These are created automatically in Supabase.

**To migrate custom habits:**
1. Note your custom habit names from localStorage
2. Recreate them in the Habits screen
3. Re-add their completion history

### Step 6: Verify Data in Supabase

In Supabase Dashboard:
1. Go to Database → Tables
2. Check each table has your data:
   - **meals** - all your meals
   - **habits** - all habits with correct streaks
   - **profiles** - your settings
   - **messages** - your chat history

### Step 7: Test Multi-Device Access

1. Open app on Device A and add a meal
2. Go to Supabase Dashboard on Device B
3. Refresh meals table - new meal appears
4. Open app on Device B
5. Meal appears automatically ✓

## Troubleshooting Migration

### "Data still in localStorage"
This is normal! The app automatically uses localStorage data if found. To force Supabase:

1. Clear browser cache (Ctrl+Shift+Delete)
2. Logout and login again
3. App will load data from Supabase

### "Data disappeared after migration"
Don't panic! Both versions still exist:

```javascript
// Check localStorage still has old data
localStorage.getItem('meals-...')  // Should show data

// New data should be in Supabase
// Go to Dashboard → meals table
```

You can always restore from localStorage if needed.

### "Supabase has wrong data"
1. Go to Supabase Dashboard → SQL Editor
2. Delete incorrect data or entire table
3. Re-run schema.sql to reset tables
4. Start fresh with correct data

### "Lost data during migration"
If you followed the export step, you have a backup:

1. Find your saved JSON file from Step 1
2. Review the data
3. Manually re-add important items
4. Consider using your exported CSV for meals

## Rollback Plan

If Supabase isn't working and you want to go back:

1. **Remove Supabase from .env.local**
   ```bash
   # Comment out or delete these lines:
   # NEXT_PUBLIC_SUPABASE_URL=...
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

2. **Restart app**
   ```bash
   npm run dev
   ```

3. **App automatically uses localStorage**
   - Your old data is still there
   - App works as before
   - You haven't lost anything

## Permanent Migration Path

To fully commit to Supabase and clean up localStorage:

1. Verify all data exists in Supabase
2. Open DevTools Console
3. Clear all localStorage:
   ```javascript
   // Warning: This is permanent!
   localStorage.clear()
   ```
4. App will only use Supabase from now on
5. You can safely delete your exported backup

## Timeline & Best Practices

### Week 1: Plan
- Decide which option (fresh start vs keep localStorage)
- Export current data as backup
- Read full Supabase setup guide

### Week 2: Setup
- Create Supabase project
- Set environment variables
- Run schema.sql
- Test basic functionality

### Week 3: Migrate
- Manually re-add data or import from CSV
- Verify data in Supabase dashboard
- Test on multiple devices

### Week 4+: Optimize
- Monitor data syncing
- Set up automated backups
- Consider advanced features

## Frequently Asked Questions

### Q: Will Supabase cost money?
**A:** Supabase has a free tier with generous limits. You only pay if you exceed quotas.

### Q: Can I use both localStorage and Supabase?
**A:** Yes! The app automatically detects Supabase credentials and uses them if available, otherwise falls back to localStorage.

### Q: What if I have data from different dates?
**A:** The migration approach handles this. You may need to manually add data from different dates.

### Q: Can I migrate back to localStorage?
**A:** Yes! If you delete Supabase credentials, app automatically uses localStorage. But data won't sync.

### Q: How long does migration take?
**A:** Setup: 10 minutes. Data import: depends on volume (minutes to hours manually).

### Q: Will my data be deleted?
**A:** No. LocalStorage data remains even after setting up Supabase. You can keep both or clear one.

---

**Need help?** Check the full setup guide: `docs/SUPABASE_SETUP.md`
