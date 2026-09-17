# 🚀 Getting Started with Budget Buddy

## Prerequisites

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- Modern web browser with JavaScript enabled

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/jhho567jhho-cmd/home-budget.git
cd home-budget
git checkout budget-buddy-nlp
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local if needed (defaults should work fine)
```

### Step 4: Run Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Budget Buddy interface! 🎉

---

## First Steps

### 1️⃣ Try Text Input

Try typing a natural expense message:
```
"קניתי לחם ב-12 שקל"
"הוצאתי 200 על דלק"
"קפה בקניון 25"
```

### 2️⃣ Try Voice Input

Click the 🎤 button to record an expense (Hebrew voice recognition).

### 3️⃣ Check Analytics

Look at the sidebar for:
- 🔄 Recurring patterns
- 💡 Savings suggestions
- ⚠️ Budget alerts
- 🔮 Monthly projections

### 4️⃣ Manage Data

Click the ⚙️ button (floating menu) to:
- 📤 Export as JSON/CSV
- 📄 Download reports
- 🗑️ Clear data

---

## Common Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
```

---

## Features Walkthrough

### 💬 Chat Interface
- Type natural language expenses
- Get instant AI responses
- See extracted data with confidence scores

### 🧠 NLP Processing
- Automatic amount detection (₪, שקל)
- Smart category classification
- Confidence scoring

### 📊 Analytics
- **Recurring Patterns**: See your spending habits
- **Savings Tips**: Get personalized suggestions
- **Budget Alerts**: Know when you're over budget
- **Monthly Forecast**: Predict end-of-month spending

### 🔊 Voice Input
- **Hebrew Speech Recognition**: Speak expenses in Hebrew
- **Auto-Submit**: Automatically processes voice input
- **Live Feedback**: Shows recording status

### 💾 Data Export
- **JSON Export**: For data analysis
- **CSV Export**: For Excel/spreadsheets
- **Text Reports**: Beautiful formatted reports

### 🎯 Budget Goals
- Set category limits
- Track spending vs. goals
- Visual progress indicators

---

## Expense Examples

### ✅ Good Examples (Clear Recognition)

```
"קניתי לחם ב-12 שקל"
Recognized: ₪12 | קניות (Shopping)

"תדלוקתי 200 שקל"
Recognized: ₪200 | דלק (Fuel)

"קורס אונליין 150 ₪"
Recognized: ₪150 | חינוך (Education)

"הזמנתי פיצה 85"
Recognized: ₪85 | בידור (Entertainment)
```

### ❌ Unclear Examples (Low Confidence)

```
"קניתי דברים"
No amount detected | Low confidence

"הוצאתי כסף"
No category detected | Needs more details

"500"
Amount only | Missing context
```

### ✨ Tips for Better Results

1. **Include amount**: Always mention the price
2. **Use currency**: Use ₪ or שקל
3. **Add context**: What did you buy?
4. **Be specific**: Instead of "קניות", say "קניתי לחם"

---

## Sidebar Features

### 📈 Statistics
- Total expenses
- Count of expenses
- Breakdown by category

### 🔄 Recurring Patterns
Shows expenses that repeat:
- Daily ☀️
- Weekly 📅
- Monthly 📊
- Confidence level

### 💡 Savings Suggestions
Smart tips to save money:
- High priority (20-25% savings)
- Medium priority (15-20% savings)
- Actionable recommendations

### ⚠️ Alerts
Real-time budget warnings:
- 🟡 Yellow: 75% of budget used
- 🔴 Red: 90%+ of budget used

### 🔮 Monthly Forecast
Prediction based on current spending:
- Calculates: (Spent ÷ Days) × 30
- Helps plan end of month

---

## Data Storage

### Where is My Data?
All data is stored in your browser's **localStorage**:
- Expenses persist between sessions
- Chat history is saved
- No cloud upload (privacy!)

### Backup Your Data
1. Click ⚙️ settings button
2. Select "📤 ייצוא" (Export)
3. Choose JSON or CSV format
4. File downloads automatically

### Restore Your Data
1. Click ⚙️ settings button
2. Click "📥 ייבוא JSON" (Import)
3. Select your backup file
4. Data restores automatically

---

## Troubleshooting

### Voice Input Not Working
- Check browser microphone permissions
- Try a different browser (Chrome, Firefox, Safari)
- Ensure you're speaking clearly in Hebrew

### Expenses Not Being Recognized
- Include a clear amount (e.g., "12 שקל")
- Be specific about what you bought
- Avoid slang or abbreviations

### Data Lost?
- Check if localStorage is enabled
- Try clearing cache and trying again
- Use our export feature to backup regularly

### Performance Issues
- Clear old expenses (Settings → Clear Data)
- Try closing other browser tabs
- Restart the development server

---

## Support

### Found a Bug? 🐛
1. Check existing issues: https://github.com/jhho567jhho-cmd/home-budget/issues
2. Create a new issue with:
   - Description of bug
   - Steps to reproduce
   - Browser/device info

### Have a Feature Request? 💡
1. Go to: https://github.com/jhho567jhho-cmd/home-budget/discussions
2. Share your idea
3. Community votes on it

### Need Help?
- Read the [FEATURES.md](FEATURES.md) for detailed features
- Check [API_DOCS.md](API_DOCS.md) for API details
- Join our community discussions

---

## Next Steps

1. **Start Tracking**: Add your first expense
2. **Check Analytics**: Review your spending patterns
3. **Set Goals**: Define budget targets
4. **Export Data**: Backup your expenses
5. **Share Feedback**: Help us improve!

---

## Quick Tips 💡

1. **Keyboard Shortcut**: Press Enter to send (Shift+Enter for newline)
2. **Recurring Expenses**: They show up automatically after 2+ similar entries
3. **Savings Tips**: Based on your actual spending data
4. **Monthly Forecast**: More accurate as you add more entries

---

## Resources

- **Documentation**: [FEATURES.md](FEATURES.md)
- **API Reference**: [API_DOCS.md](API_DOCS.md)
- **GitHub**: [home-budget](https://github.com/jhho567jhho-cmd/home-budget)
- **Discussions**: [GitHub Discussions](https://github.com/jhho567jhho-cmd/home-budget/discussions)

---

## License

MIT © 2026 Budget Buddy Contributors

---

**Ready to start? Visit http://localhost:3000 and track your first expense!** 🚀

Made with ❤️ in Israel 🇮🇱
