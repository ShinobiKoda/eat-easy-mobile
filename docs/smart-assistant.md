# Smart Assistant

The Smart Assistant is an AI-powered meal recommendation feature that guides users through a 3-step preference wizard, then uses Google Gemini to generate personalized dish suggestions.

---

## User Flow

```
┌─────────────────────────────┐
│  ChooseVirtualAssistant     │
│  (Entry point)              │
│                             │
│  Has past recommendations?  │
│  ├── Yes → MakeRecommendations (choose new vs. last)
│  └── No  → Welcome screen   │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Step 1: Mood Selection     │
│  (Multi-select feelings)    │
│  Saves to: AsyncStorage     │
│  Key: eat-easy-rec-moods    │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Step 2: Party Size         │
│  (Single-select companion)  │
│  Saves to: AsyncStorage     │
│  Key: eat-easy-rec-party    │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Step 3: Budget Range       │
│  (Single-select budget)     │
│  Saves to: AsyncStorage     │
│  Key: eat-easy-rec-budget   │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Generating                 │
│  1. Read prefs from storage │
│  2. Check daily limit       │
│  3. Fetch menu items        │
│  4. Call Gemini AI           │
│  5. Save to Supabase        │
│  6. Store item IDs          │
│  7. Navigate to results     │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  ShowRecommendations        │
│  - Load items from menu     │
│  - Display result cards     │
│  - Tap to view/add to cart  │
│  - "New recommendation" btn │
└─────────────────────────────┘
```

---

## State Passing Strategy

Since Expo Router uses URL-based navigation (no route state objects like React Router), the Smart Assistant uses **AsyncStorage** to pass preferences between steps:

| Key | Set by | Read by | Value |
|-----|--------|---------|-------|
| `eat-easy-rec-moods` | Step 1 | Generating | `string[]` (JSON) |
| `eat-easy-rec-party` | Step 2 | Generating | `string` |
| `eat-easy-rec-budget` | Step 3 | Generating | `string` |
| `eat-easy-rec-item-ids` | Generating | ShowRecommendations | `number[]` (JSON) |

---

## Daily Limit

Each user is limited to **1 AI recommendation per day**:

1. Before calling Gemini, `Generating.tsx` checks the `recommendations` table for any entries created today
2. If found, it skips the AI call and redirects to `ShowRecommendations` with the existing item IDs
3. This saves API costs and prevents abuse

---

## Gemini Integration

### Model Configuration

```typescript
// lib/geminiClient.ts
model: "gemini-2.5-flash"
temperature: 0.7
maxOutputTokens: 4096
responseMimeType: "application/json"
```

### Prompt Format

The prompt sends a compressed version of the full menu to minimize token usage:

```
Select 6-9 menu items.
USER: Moods(Hungry,Tired), Budget(₦5,000 - ₦10,000), Size(Friends).
MENU: [{"i":1,"n":"Jollof Rice","p":15.99,"r":4.5,"t":["rice","spicy"]}, ...]
OUTPUT JSON: {"item_ids": [number], "reasoning": "short string"}
```

### Response Handling

1. Parse JSON response
2. If parsing fails, attempt regex extraction of `item_ids` array
3. Validate each ID exists in the actual menu
4. Filter out invalid IDs
5. If no valid IDs remain, throw error

---

## Pages Reference

| Page | File | Purpose |
|------|------|---------|
| Entry | `ChooseVirtualAssistant.tsx` | Checks for past recs, routes accordingly |
| Returning User | `MakeRecommendations.tsx` | Choose "new" vs "use last" |
| Step 1 | `RecommendationFirstStep.tsx` | Mood selection (multi-select) |
| Step 2 | `RecommendationSecondStep.tsx` | Party size (single-select) |
| Step 3 | `RecommendationThirdStep.tsx` | Budget range (single-select) |
| AI Loading | `Generating.tsx` | Animated loading + Gemini call |
| Results | `ShowRecommendations.tsx` | Display recommended dishes |
