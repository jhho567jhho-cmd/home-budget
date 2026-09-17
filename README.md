# 🤖 Budget Buddy - NLP AI Budget Assistant

**עוזר תקציב חכם בעברית** המבין שפה טבעית ועוזר לניהול הוצאות בצורה אינטליגנטית.

## ✨ תכונות

### 🗣️ NLP - Natural Language Processing
- **הבנת שפה טבעית בעברית** - כתוב כמו שמדברים:
  - "קניתי לחם ב-12 שקל" 
  - "הוצאתי 200 על דלק"
  - "קפה בקניון 25 שקל"

### 💡 AI-Powered Features
- ✅ **זיהוי ישויות** - חילוץ סכום, קטגוריה ותיאור מהטקסט
- ✅ **סיווג אוטומטי** - סיווג הוצאות לקטגוריות חכמה
- ✅ **תגובות חכמות** - Buddy משחזר עם תגובות בעברית טבעית
- ✅ **ניתוח סנטימנט** - הבנה של המצב הרגשוני

### 📊 ניהול תקציב
- 📈 סיכום הוצאות בזמן אמת
- 📑 עקיבות לפי קטגוריות
- 💾 היסטוריה של כל הוצאה
- 📱 ממשק תכול וידידותי

## 🛠️ סטאק טכנולוגי

```
Frontend:     Next.js 14 + React 18 + TypeScript
Styling:      Tailwind CSS
NLP:          Custom Hebrew NLP Engine
Backend:      Next.js API Routes
Language:     עברית (RTL/LTR Support)
```

## 🚀 התקנה מהירה

### דרישות
- Node.js 18+
- npm או yarn

### צעדים

```bash
# 1. התקן תלויות
npm install

# 2. הפעל את האפליקציה
npm run dev

# 3. פתח בדפדפן
open http://localhost:3000
```

## 📝 דוגמאות שימוש

```
👤 משתמש: קניתי חלב ב-15 שקל בסופר
🤖 Buddy: ✓ הוספתי הוצאה של 15 שקל בקטגוריית קניות

👤 משתמש: תדלוקתי 200 שקל
🤖 Buddy: ⛽ תדלוק חדש: 200 שקל

👤 משתמש: הזמנתי הפיצה 85
🤖 Buddy: 🍕 הוצאה בבידור: 85 שקל
```

## 🏗️ מבנה הפרויקט

```
budget-buddy-nlp/
├── app/
│   ├── api/chat/          # Chat API endpoint
│   ├── components/        # React components
│   │   ├── ChatMessage    # Message display
│   │   └── ChatInput      # Input field
│   ├── utils/
│   │   └── nlp.ts         # NLP processing engine
│   ├── page.tsx           # Main page with chat
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🧠 NLP Engine Details

### Supported Categories (קטגוריות)
- 🛒 **קניות** - מוצרים, סופרמרקט, מזון
- ⚡ **שירותים** - חשמל, מים, גז, אינטרנט
- ⛽ **דלק** - בנזין, תדלוק
- 🎬 **בידור** - קולנוע, מסעדה, בר
- 🏥 **בריאות** - רופא, תרופות, בית חולים
- ⚽ **ספורט** - ג'ים, קורסים
- 📚 **חינוך** - ספרים, קורסים
- 🚗 **תחבורה** - רכבת, אוטובוס, טקסי

### Currency Recognition
Recognizes: `₪`, `שקל`, `שח`

## 🔮 Roadmap - פיתוח בעתיד

- [ ] Machine Learning Model Training
- [ ] Budget Forecasting
- [ ] Recurring Expenses Detection
- [ ] Smart Recommendations
- [ ] Database Integration
- [ ] User Profiles & History
- [ ] Mobile App (React Native)
- [ ] Export Reports (PDF)
- [ ] Multi-Language Support

## 💻 Development

```bash
# Dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🎯 How It Works

1. **User Input** → משתמש כותב בעברית טבעית
2. **NLP Processing** → המערכת מנתחת את הטקסט
3. **Entity Extraction** → חילוץ סכום, קטגוריה, תיאור
4. **Confidence Score** → חישוב ביטחון בתוצאה
5. **Response Generation** → יצירת תגובה טבעית
6. **Storage** → שמירה בזיכרון (בהמשך: database)

## 🎨 UI/UX

- 🌙 **Dark Mode** - ממשק כהה עם גרדיאנט סגול-אדום
- 📱 **Responsive** - עבודה על כל הגדלי מסכנים
- ⚡ **Smooth Animations** - אנימציות חלקות לחוויה טובה
- 🔤 **RTL Support** - תמיכה מלאה בעברית

## 📄 רישיון

MIT

---

**Made with ❤️ in Israel** 🇮🇱

עם 🤖 AI Magic ✨
