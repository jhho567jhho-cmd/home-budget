# 🔌 Budget Buddy - API Documentation

## Overview

Budget Buddy provides a simple REST API for processing natural language budget entries and generating intelligent responses.

## Endpoints

### `POST /api/chat`

Process a natural language message and extract expense data.

**URL**: `http://localhost:3000/api/chat`

**Method**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "message": "קניתי לחם ב-12 שקל"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "response": "✓ הוספתי הוצאה של 12 שקל בקטגוריית קניות",
  "expenseData": {
    "amount": 12,
    "category": "קניות",
    "confidence": 0.9
  }
}
```

**Response (Error)**:
```json
{
  "error": "Invalid message"
}
```

**Status Codes**:
- `200`: Success
- `400`: Bad request (invalid message)
- `500`: Internal server error

---

## Request Examples

### Example 1: Simple Purchase
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "קניתי חלב ב-15 שקל"}'
```

**Response**:
```json
{
  "success": true,
  "response": "🛒 רשמתי הוצאה בסופר: 15 שקל",
  "expenseData": {
    "amount": 15,
    "category": "קניות",
    "confidence": 0.85
  }
}
```

### Example 2: Fuel Purchase
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "תדלוקתי 200 שקל"}'
```

**Response**:
```json
{
  "success": true,
  "response": "⛽ תדלוק חדש: 200 שקל",
  "expenseData": {
    "amount": 200,
    "category": "דלק",
    "confidence": 0.95
  }
}
```

### Example 3: No Amount Specified
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "הוצאתי כסף על קניות"}'
```

**Response**:
```json
{
  "success": true,
  "response": "בואו תהיו יותר ספציפיים! כמה הוצאתם בדיוק? 💭",
  "expenseData": {
    "amount": null,
    "category": "קניות",
    "confidence": 0.6
  }
}
```

---

## Response Object Details

### `expenseData`

| Field | Type | Description |
|-------|------|-------------|
| `amount` | `number \| null` | Extracted expense amount in shekels |
| `category` | `string` | Categorized expense type |
| `confidence` | `number` | Confidence score (0.0 - 1.0) |

### Confidence Scoring

- **0.9-1.0**: High confidence (amount + category clearly identified)
- **0.7-0.9**: Medium confidence (category identified, some ambiguity)
- **0.5-0.7**: Low confidence (partial match or no amount)
- **< 0.5**: Very low confidence (unclear input)

---

## Currency Recognition

The API recognizes multiple currency formats:

```
₪12.50      → 12.50
12.50 ₪     → 12.50
12.50 שקל   → 12.50
12,50 שקל   → 12.50
```

---

## Category List

The API automatically categorizes expenses into these types:

```
קניות       - Groceries, shopping
שירותים    - Utilities, services
דלק        - Fuel, gas
בידור      - Entertainment, dining
בריאות     - Healthcare, medical
ספורט      - Sports, fitness
חינוך      - Education
תחבורה     - Transportation
אחר        - Other
```

---

## Error Handling

### Invalid Message
```json
{
  "error": "Invalid message"
}
```

**Status**: `400`

### Server Error
```json
{
  "error": "Internal server error"
}
```

**Status**: `500`

---

## Rate Limiting

Currently no rate limiting is enforced. For production use, implement:
- Per-IP rate limits (e.g., 100 requests/minute)
- User-based rate limits with authentication
- Exponential backoff for retries

---

## Future API Features

### Planned Endpoints

#### GET `/api/expenses`
Retrieve all recorded expenses

**Query Parameters**:
- `category`: Filter by category
- `startDate`: Filter from date
- `endDate`: Filter to date
- `limit`: Max results (default: 50)

#### GET `/api/analytics`
Get spending analytics and insights

**Query Parameters**:
- `period`: "week", "month", "year"

#### POST `/api/budget`
Set budget limits

```json
{
  "category": "קניות",
  "limit": 2000,
  "month": 9,
  "year": 2026
}
```

#### POST `/api/suggestions`
Get personalized savings suggestions

```json
{
  "timeframe": "month"
}
```

---

## TypeScript Types

```typescript
interface ChatRequest {
  message: string
}

interface ChatResponse {
  success: boolean
  response: string
  expenseData: {
    amount: number | null
    category: string
    confidence: number
  }
}

interface Expense {
  id: number
  amount: number
  category: string
  description: string
  timestamp: Date
  confidence: number
}
```

---

## Testing

### Using Postman

1. Create new POST request
2. URL: `http://localhost:3000/api/chat`
3. Body (raw JSON):
```json
{
  "message": "קניתי לחם ב-12 שקל"
}
```
4. Send request

### Using JavaScript/Fetch

```javascript
async function trackExpense(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
  
  const data = await response.json()
  console.log(data)
}

trackExpense("קניתי לחם ב-12 שקל")
```

### Using Python/Requests

```python
import requests

url = "http://localhost:3000/api/chat"
payload = {
    "message": "קניתי לחם ב-12 שקל"
}

response = requests.post(url, json=payload)
print(response.json())
```

---

## Best Practices

1. **Input Validation**: Always validate message before sending
2. **Error Handling**: Implement try-catch for API calls
3. **Retry Logic**: Implement exponential backoff for failures
4. **Caching**: Cache frequent queries when possible
5. **Logging**: Log all API interactions for debugging

---

## Support & Debugging

### Common Issues

**Empty Amount Detected**
- Ensure currency format is clear
- Use ₪ symbol or שקל word
- Example: "קניתי 15 שקל" ✅ vs "קניתי שקל" ❌

**Wrong Category**
- Try being more specific
- Use category keywords
- Example: "קניתי לחם בסופר" ✅ vs "קניתי דברים" ❌

**Low Confidence Score**
- Provide more context
- Be specific about amount and type
- Example: "הוצאתי 50 שקל על קפה בקניון" ✅

---

## Version History

### v1.0.0 (Current)
- Initial release
- NLP entity extraction
- 8+ category support
- Confidence scoring
- Hebrew language support

---

**API Version**: 1.0.0  
**Last Updated**: 2026-09-17  
**Status**: 🟢 Active
