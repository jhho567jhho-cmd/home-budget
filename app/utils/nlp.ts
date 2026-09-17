// Hebrew NLP utilities for expense extraction

interface ExpenseData {
  amount: number | null
  category: string
  description: string
  confidence: number
}

// Hebrew currency patterns
const currencyPatterns = [
  /₪\s*(\d+(?:[.,]\d{1,2})?)/,
  /(\d+(?:[.,]\d{1,2})?)\s*₪/,
  /(\d+(?:[.,]\d{1,2})?)\s*שקל/,
];

// Category keywords in Hebrew
const categoryKeywords: Record<string, string[]> = {
  'קניות': ['לחם', 'קניות', 'סופר', 'טבח', 'מוצרים', 'פרוטאים', 'תבלינים', 'פירות', 'ירקות'],
  'שירותים': ['חשמל', 'מים', 'גז', 'אינטרנט', 'טלפון', 'שיעור', 'קורס'],
  'דלק': ['דלק', 'בנזין', 'גז', 'תדלוק', 'תחנת דלק'],
  'בידור': ['קולנוע', 'סרט', 'משחק', 'טיול', 'מסעדה', 'קפה', 'בר'],
  'בריאות': ['תרופה', 'רופא', 'בית חולים', 'דנטיסט', 'בריאות', 'פרמקיה'],
  'ספורט': ['ספורט', 'כושר', 'חדר כושר', 'ג\'ימ', 'כדורגל', 'מחנה'],
  'חינוך': ['ספר', 'חינוך', 'שיעור', 'קורס', 'ביה״ס', 'אוניברסיטה'],
  'תחבורה': ['תחבורה', 'רכבת', 'אוטובוס', 'טקסי', 'רכב', 'בנזין'],
};

export function extractExpenseData(text: string): ExpenseData {
  // Extract amount
  let amount: number | null = null;
  let confidence = 0.5;

  for (const pattern of currencyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const numberStr = match[1].replace(',', '.');
      amount = parseFloat(numberStr);
      confidence = 0.9;
      break;
    }
  }

  // Extract category
  let category = 'אחר';
  let maxMatches = 0;

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    const matches = keywords.filter(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    ).length;

    if (matches > maxMatches) {
      maxMatches = matches;
      category = cat;
      confidence = Math.min(0.95, 0.5 + matches * 0.2);
    }
  }

  // Extract description (first meaningful part)
  const words = text.split(' ').slice(0, 5).join(' ');

  return {
    amount,
    category,
    description: text,
    confidence,
  };
}

// Sentiment analysis (simple Hebrew version)
export function analyzeSentiment(text: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['טוב', 'מעולה', 'נחמד', 'יפה', 'מוצלח', 'שמח'];
  const negativeWords = ['גרוע', 'רע', 'כואב', 'עצוב', 'קשה', 'בעיה'];

  const lowerText = text.toLowerCase();

  const posCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negCount = negativeWords.filter(word => lowerText.includes(word)).length;

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

// Generate AI response based on expense
export function generateResponse(expenseData: ExpenseData): string {
  const responses: Record<string, string[]> = {
    'קניות': [
      '✓ הוספתי הוצאה של {amount} שקל בקטגוריית קניות',
      '🛒 רשמתי הוצאה בסופר: {amount} שקל',
      '📝 הוצאת {amount} שקל על קניות - בדוק אם זה בתקציב!',
    ],
    'שירותים': [
      '⚡ הוספתי תשלום שירות של {amount} שקל',
      '💡 רשמתי {amount} שקל לשירותים',
    ],
    'דלק': [
      '⛽ תדלוק חדש: {amount} שקל',
      '🚗 הוצאת {amount} שקל על דלק',
    ],
    'בידור': [
      '🎬 משהו כיף עלה לך {amount} שקל!',
      '🎉 הוצאה בבידור: {amount} שקל',
    ],
    'אחר': [
      '💰 הוספתי הוצאה של {amount} שקל',
      '📊 רשמתי {amount} שקל לחשבון',
    ],
  };

  const categoryResponses = responses[expenseData.category] || responses['אחר'];
  const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

  if (expenseData.amount) {
    return randomResponse.replace('{amount}', expenseData.amount.toFixed(2));
  }

  return 'בואו תהיו יותר ספציפיים! כמה הוצאתם בדיוק? 💭';
}

// Check if text is in Hebrew
export function isHebrew(text: string): boolean {
  const hebrewRegex = /[֐-׿]/;
  return hebrewRegex.test(text);
}

// Validate amount
export function isValidAmount(amount: number | null): boolean {
  return amount !== null && amount > 0 && amount < 1000000;
}
