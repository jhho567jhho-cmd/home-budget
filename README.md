# תקציב הבית - Home Budget

אפליקציית ניהול תקציב חכמה בעברית לניהול הוצאות, מלאי וחיסכון.

## 🎯 תכונות

### 1. 📋 ניהול הוצאות
- עקוב אחרי הוצאות לפי קטגוריות
- הוסף תאריכים וכמויות
- צפה בדוחות והתמצאויות

### 2. 📦 מעקב מלאי
- ניהול חומרים ומוצרים
- זיהוי תאריכי פקיעה
- התראות כאשר פריטים קרובים לסוף
- ערך מלאי כולל

### 3. 💰 מחשבון חיסכון
- עצות לחיסכון
- השוואת מחירים בין קניונים
- ניתוח הוצאות חוזרות
- חישוב פוטנציאל חיסכון חודשי

## 🛠️ סטאק טכנולוגי

- **Frontend:** Next.js 14 + React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL + Prisma ORM
- **Language:** עברית (RTL Support)

## 📦 התקנה

### דרישות
- Node.js 18+
- PostgreSQL 12+

### צעדים

1. **התקן תלויות:**
```bash
npm install
```

2. **הגדר את ה-environment:**
```bash
cp .env.example .env.local
# ערוך את .env.local והוסף את DATABASE_URL שלך
```

3. **עדכן את בסיס הנתונים:**
```bash
npx prisma migrate dev --name init
```

4. **הפעל את אפליקציית הפיתוח:**
```bash
npm run dev
```

5. **פתח את האפליקציה:**
```bash
http://localhost:3000
```

## 📁 מבנה הפרויקט

```
home-budget/
├── app/
│   ├── layout.tsx          # Layout עיקרי
│   ├── page.tsx            # דף הבית
│   ├── globals.css         # סגנונות גלובליים
│   ├── expenses/           # דף ניהול הוצאות
│   ├── inventory/          # דף מעקב מלאי
│   └── savings/            # דף מחשבון חיסכון
├── prisma/
│   └── schema.prisma       # Schema בסיס הנתונים
├── package.json            # תלויות
├── tsconfig.json           # קונפיגורציית TypeScript
├── tailwind.config.js      # קונפיגורציית Tailwind
└── README.md               # קובץ זה
```

## 🚀 צעדים הבאים

- [ ] הוסף אימות משתמשים
- [ ] אחסן נתונים בבסיס הנתונים
- [ ] הוסף גרפיקות וסטטיסטיקות
- [ ] אוטומציה של דוחות חודשיים
- [ ] אפליקציית מובייל

## 📝 רישיון

MIT

---

בנוי עם ❤️ בעברית
