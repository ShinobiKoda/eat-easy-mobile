# Services

All services live in the `services/` directory and interact with Supabase via the client exported from `lib/Supabase.ts`.

---

## menuService

**File**: `services/menuService.ts`

Fetches menu items from the dedicated menu Supabase project.

| Method | Returns | Description |
|--------|---------|-------------|
| `getMenuItems()` | `PropType[]` | Fetches all items from `eat_easy_menu` |

> Uses a **separate Supabase client** (`EXPO_PUBLIC_SUPABASE_MENU_URL`) since menu data may live on a different project than auth/orders.

---

## orderService

**File**: `services/orderService.ts`

Manages order persistence in the `eat_easy_orders` table.

| Method | Returns | Description |
|--------|---------|-------------|
| `saveOrder(payload)` | `OrderRecord` | Inserts a new order for the authenticated user |
| `getUserOrders()` | `OrderRecord[]` | Fetches all orders for the current user, newest first |

### OrderRecord Schema

```typescript
interface OrderRecord {
  id: string;
  restaurantName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: string;
}
```

---

## cardService

**File**: `services/cardService.ts`

Manages saved payment cards in the `eat_easy_cards` table.

| Method | Returns | Description |
|--------|---------|-------------|
| `saveCard(card)` | `CardDetails` | Saves a new card for the authenticated user |
| `getUserCards()` | `CardDetails[]` | Fetches all cards for the current user |

---

## couponService

**File**: `services/couponService.ts`

Full coupon lifecycle management with caching.

| Method | Returns | Description |
|--------|---------|-------------|
| `getUserCoupons(force?)` | `Coupon[]` | Fetches all coupons (30s cache) |
| `getActiveCoupons(force?)` | `Coupon[]` | Filters to non-expired, unused coupons |
| `validateCouponCode(code)` | `Coupon` | Validates a discount code at checkout |
| `redeemCoupon(id)` | `void` | Marks a coupon as used |
| `grantWelcomeCoupon(userId)` | `void` | Grants 30% off welcome coupon (once) |
| `evaluatePostOrderRewards()` | `void` | Checks milestones and lucky day after each order |

### Reward Logic

**Weekly Milestones** (resets each Monday):
- 15 orders → 5% discount coupon
- 30 orders → 10% discount coupon
- 50 orders → 15% discount coupon

**Lucky Day**:
- A deterministic "lucky day" is calculated per user per week
- If the user orders 3+ items on their lucky day → free drink coupon

---

## recommendationService

**File**: `services/recommendationService.ts`

Calls Google Gemini AI to generate personalized menu recommendations.

| Method | Returns | Description |
|--------|---------|-------------|
| `generateRecommendations(params, menuItems)` | `number[]` | Returns 6-9 recommended item IDs |

### How It Works

1. User preferences (moods, budget, party size) are collected via the 3-step wizard
2. All menu items are compressed into a minimal JSON format to save tokens
3. Gemini receives a prompt requesting 6-9 item IDs with reasoning
4. Response is parsed and validated against actual menu IDs
5. Invalid or missing IDs are filtered out

---

## recommendationHistoryService

**File**: `services/recommendationHistoryService.ts`

Persists AI recommendations to the `recommendations` Supabase table.

| Method | Returns | Description |
|--------|---------|-------------|
| `getLatestRecommendation()` | `Recommendation \| null` | Fetches the user's most recent recommendation |
| `saveRecommendation(input)` | `Recommendation` | Saves a new recommendation |
| `hasRecommendations()` | `boolean` | Checks if user has any past recommendations |

---

## Supabase Tables

| Table | Purpose |
|-------|---------|
| `eat_easy_menu` | Menu items (name, price, image, rating, tags) |
| `eat_easy_orders` | Completed orders with items and totals |
| `eat_easy_cards` | Saved payment cards |
| `eat_easy_coupons` | Discount coupons (welcome, milestone, free_drink) |
| `recommendations` | AI recommendation history (moods, item_ids, etc.) |
