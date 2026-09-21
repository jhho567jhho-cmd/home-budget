# Testing Guide - Supabase Integration

This guide helps verify that the Supabase integration is working correctly.

## Test Environment Setup

### Without Supabase (localStorage mode)
```bash
# .env.local should NOT have Supabase credentials
npm run dev
```

The app will:
- Show warning: "Supabase credentials missing. Using localStorage fallback."
- Store all data in browser localStorage
- Work offline
- Data persists only on same device/browser

### With Supabase (cloud mode)
```bash
# .env.local should have all Supabase credentials
npm run dev
```

The app will:
- Connect to Supabase automatically
- Store all data in cloud database
- Sync across devices
- Show no warning messages

## Testing Checklist

### 1. Authentication

**LocalStorage Mode:**
- [ ] Login with a name (e.g., "Test User")
- [ ] User is stored locally
- [ ] Logout clears all data
- [ ] Login again shows empty data (fresh start)

**Supabase Mode:**
- [ ] Login works (currently generates random ID)
- [ ] User session persists across page reloads
- [ ] User data loads from database
- [ ] Logout clears local session

### 2. Meals Management

**Core Functionality:**
- [ ] Add a meal with name, type, time, calories
- [ ] Meal appears in list immediately
- [ ] Toggle meal completion (shows checkmark)
- [ ] Remove a meal
- [ ] Update meal information
- [ ] Meals persist after page reload

**Data Validation:**
- [ ] Cannot add meal without name
- [ ] Time field shows correct format (HH:mm)
- [ ] Calories accepts only numbers
- [ ] Notes field allows any text

**LocalStorage Mode:**
- [ ] All changes stored in browser localStorage
- [ ] Data key format: `meals-${userId}-${date}`

**Supabase Mode:**
- [ ] Changes sync to database immediately
- [ ] Open app in another browser - meals appear
- [ ] All meals visible in Supabase dashboard

### 3. Habits Management

**Core Functionality:**
- [ ] Default 4 habits appear on first login
- [ ] Add custom habit with name and category
- [ ] Toggle habit completion
- [ ] Streak increases when completed daily
- [ ] Streak resets when not completed
- [ ] Remove a habit
- [ ] Habits persist after page reload

**Streak Calculation:**
- [ ] Mark habit complete (streak = 1)
- [ ] Go back next day, mark complete (streak = 2)
- [ ] Skip a day, mark complete (streak resets to 1)

**LocalStorage Mode:**
- [ ] All changes stored in browser localStorage
- [ ] Data key format: `habits-${userId}-${date}`

**Supabase Mode:**
- [ ] Changes sync to database immediately
- [ ] Streak values persist correctly

### 4. Statistics

- [ ] Total calories calculated correctly
- [ ] Completed meals count accurate
- [ ] Habit streak bar chart displays
- [ ] Meal distribution pie chart shows all types
- [ ] Completion percentage calculates correctly

### 5. AI Assistant

- [ ] Chat interface loads
- [ ] Can send messages
- [ ] Receives responses from Claude API
- [ ] Messages display in correct order
- [ ] Messages persist (or clear if designed to)

**LocalStorage Mode:**
- [ ] Conversation history stored locally
- [ ] Clears on logout

**Supabase Mode:**
- [ ] Messages stored in database
- [ ] History loads on subsequent visits
- [ ] Same history visible in Supabase dashboard

### 6. Profile Settings

- [ ] Can view profile information
- [ ] Can edit meal times
- [ ] Can set daily goals
- [ ] Changes persist after reload
- [ ] Logout clears session

**LocalStorage Mode:**
- [ ] Data key format: `profile-${userId}`

**Supabase Mode:**
- [ ] Changes sync to database
- [ ] Visible in Supabase dashboard

### 7. Export Functionality

- [ ] Export as JSON downloads file
- [ ] Export as CSV downloads file
- [ ] Export as Report downloads text file
- [ ] All exports contain current data
- [ ] Files save with proper names/timestamps

### 8. Error Handling

**LocalStorage Mode:**
- [ ] Page works offline
- [ ] No network errors
- [ ] All operations complete instantly

**Supabase Mode:**
- [ ] Network errors show gracefully
- [ ] Operations retry on network issues
- [ ] Clear error messages in console

### 9. Data Migration

**LocalStorage → Supabase:**
- [ ] Existing localStorage data visible (if implementing sync)
- [ ] New data created in Supabase only
- [ ] Old data still accessible via localStorage

## Browser Developer Tools Testing

### LocalStorage Inspection
```javascript
// Check current user
JSON.parse(localStorage.getItem('app-user'))

// Check meals for today
const today = new Date().toISOString().split('T')[0]
const meals = localStorage.getItem(`meals-${userId}-${today}`)

// Check habits
const habits = localStorage.getItem(`habits-${userId}`)
```

### Supabase Dashboard Verification
1. Go to Supabase Dashboard
2. Click Database
3. Check each table:
   - **users**: Should have your user record
   - **meals**: Should show all meals you added
   - **habits**: Should show all habits
   - **profiles**: Should have your profile
   - **messages**: Should have conversation history

### Network Activity
1. Open DevTools → Network tab
2. Perform actions (add meal, toggle habit)
3. Should see requests to:
   - Supabase API endpoint
   - Claude API (for chat messages)

## Performance Testing

### Load Test
- [ ] Add 50+ meals - check UI responsiveness
- [ ] Create 20+ habits - verify list scrolls smoothly
- [ ] Send 100+ chat messages - confirm history loads quickly

### Speed Benchmarks
- [ ] Add meal: < 1 second (localStorage), < 2 seconds (Supabase)
- [ ] Toggle habit: < 1 second (localStorage), < 2 seconds (Supabase)
- [ ] Page load: < 3 seconds with data loaded

## Cross-Device Testing

### With Supabase
1. Login on Device A (PC/Mac)
2. Add some meals
3. Open app on Device B (mobile/different browser)
4. Meals should appear immediately on Device B
5. Add meal on Device B
6. Refresh Device A - see the new meal

### With LocalStorage
1. Add meal on Device A
2. Open app on Device B
3. Meal will NOT appear (local only)
4. Expected behavior ✓

## Fallback Testing

### Supabase Offline
1. Set wrong Supabase URL in .env.local
2. App should use localStorage fallback
3. All functionality works locally
4. Warning in console: "Supabase credentials missing..."

### Network Failure
1. Open DevTools → Network
2. Set throttling to "Offline"
3. Try to add meal in Supabase mode
4. Should fail gracefully or queue for sync

## Reported Issues Template

If you find a bug:

```markdown
**Bug:** [Short description]

**Environment:** 
- Mode: [ ] LocalStorage [ ] Supabase
- Browser: [Chrome/Firefox/Safari/etc]
- Device: [Desktop/Mobile]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected:** 

**Actual:** 

**Console Errors:** [Copy from DevTools]

**LocalStorage Data:**
[Run: JSON.parse(localStorage.getItem('app-user'))]

**Screenshots:** [If applicable]
```

## Success Criteria

Application is working correctly when:

✅ **LocalStorage Mode:**
- All CRUD operations complete instantly
- Data persists across page reloads
- Data not visible in other browsers/devices

✅ **Supabase Mode:**
- All CRUD operations complete within 2 seconds
- Data syncs to Supabase database
- Data visible across multiple devices
- Data visible in Supabase dashboard
- Network errors handled gracefully

✅ **Both Modes:**
- No console errors
- UI responsive and no lag
- Export functions work
- Statistics calculated correctly
- AI chat functional (if API key set)

---

**Questions?** Check the main Supabase setup guide at `docs/SUPABASE_SETUP.md`
