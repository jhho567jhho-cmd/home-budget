# Home Budget Manager - CLAUDE.md

## Project Overview
מערכת מקיפה לניהול תקציב בית בעברית. אפליקציה ווב עם React המאפשרת ניהול הכנסות, הוצאות, תקציבים וניתוחים כלכליים.

## Key Features
- 📊 דוח כללי עם סיכום הכנסות/הוצאות ויתרה
- 💰 ניהול עסקאות (הוצאות והכנסות)
- 📈 ניהול תקציבים חודשיים לפי קטגוריה
- 📉 דוחות וניתוחים מפורטים
- 🏷️ ניהול קטגוריות מותאמות
- 💾 שמירה מקומית ב-localStorage

## Tech Stack
- React 18
- Recharts (charts and graphs)
- React Icons
- CSS3 (Flexbox, Grid)

## Project Structure
```
home-budget/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── TransactionForm.js
│   │   ├── TransactionList.js
│   │   ├── BudgetManager.js
│   │   └── Reports.js
│   ├── utils/
│   │   ├── storage.js
│   │   └── helpers.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
├── README.md
└── CLAUDE.md
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm

### Installation
```bash
npm install
```

### Development
```bash
npm start
```
Open http://localhost:3000 in browser

### Build
```bash
npm run build
```

## Features Details

### Dashboard (דוח כללי)
- קטנים מסכמים: הכנסות, הוצאות, יתרה
- תרשים עוגה של התפלגות הוצאות
- 5 עסקאות אחרונות

### Transactions (עסקאות)
- הוסף/מחק עסקאות
- הגדר תאריך, קטגוריה, סכום
- מיון לפי חודש וסדר (חדש לישן / ישן לחדש)
- תיאורים אופציונליים

### Budget (תקציבים)
- הגדר תקציב חודשי לכל קטגוריה
- ראה השוואה בין הצפוי לבפועל
- יצירת קטגוריות חדשות
- אזהרה כאשר עוברים תקציב

### Reports (ניתוחים)
- גרף הכנסות/הוצאות חודשי
- גרף עמודות הוצאות לפי קטגוריה
- סטטיסטיקות: סה״כ, ממוצע, מקס, מינ
- טבלה מסכמת לפי קטגוריה

### Settings (הגדרות)
- מחיקת כל הנתונים

## Data Storage
כל הנתונים נשמרים ב-localStorage של הדפדפן:
- `home_budget_transactions` - רשימת כל העסקאות
- `home_budget_budget` - תקציבים לפי קטגוריה
- `home_budget_categories` - קטגוריות

## Default Categories
### Expenses
- מזון וקניות
- שכר דירה/משכנתא
- חשמל ומים
- תחבורה
- בריאות
- בידור
- ביטוחים
- חינוך
- חיסכון

### Income
- משכורת
- מענק
- הכנסה נוספת

## UI/UX
- Design תגובתי (responsive) לכל גדלי המסכנים
- ממשק בעברית (RTL)
- צבעים ותרשימים בהירים
- סגנון מודרני עם gradients

## Notes for Development
- כל הקומפוננטות הן functional components עם hooks
- השימוש ב-useMemo לייעול performance
- localStorage ניתן להחליף ב-backend API בעתיד
- הפרויקט מוכן להוספת עוד תכונות וניתוחים
