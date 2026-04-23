# Architecture

## Overview

EatEasy Mobile is built with **Expo SDK 52** and uses **file-based routing** via `expo-router`. The app follows a layered architecture separating UI, state management, and data access.

```
┌──────────────────────────────────────┐
│            Screens (app/)            │
│  File-based routes via expo-router   │
├──────────────────────────────────────┤
│         Components (components/)     │
│  Reusable UI: Header, ViewDish, etc  │
├──────────────────────────────────────┤
│     State Management (contexts/)     │
│  Order, Restaurant, Location, Theme  │
├──────────────────────────────────────┤
│       Services (services/)           │
│  Supabase queries, Gemini AI calls   │
├──────────────────────────────────────┤
│         Clients (lib/)               │
│     Supabase client, Gemini client   │
└──────────────────────────────────────┘
```

---

## Navigation Structure

The app uses Expo Router's group-based layout system:

```
app/
├── _layout.tsx              → Root layout (providers, fonts, splash)
├── index.tsx                → Splash / entry screen
├── GetStarted.tsx           → Onboarding
├── SignInOptions.tsx         → Auth options
├── (auth)/                  → Unauthenticated routes
│   └── CreateAccount.tsx
├── (protected)/             → Authenticated routes (requires session)
│   ├── _layout.tsx          → Auth guard layout
│   ├── Homepage.tsx         → Dashboard
│   ├── FullMenu.tsx         → Browse & order
│   ├── OrderCheckout.tsx    → Payment flow
│   ├── OrderStatus.tsx      → Live order tracking
│   ├── OrderHistory.tsx     → Past orders
│   ├── Profile.tsx          → User settings
│   ├── Rewards.tsx          → Coupons & milestones
│   ├── Help.tsx             → FAQ & support
│   ├── Restaurants.tsx      → Restaurant picker
│   └── (virtual_assistant)/ → AI recommendation flow
│       ├── ChooseVirtualAssistant.tsx
│       ├── MakeRecommendations.tsx
│       ├── RecommendationFirstStep.tsx
│       ├── RecommendationSecondStep.tsx
│       ├── RecommendationThirdStep.tsx
│       ├── Generating.tsx
│       └── ShowRecommendations.tsx
└── auth/
    └── callback.tsx         → OAuth callback handler
```

---

## State Management

### Context Providers

| Context | Responsibility |
|---------|---------------|
| **OrderContext** | Cart items, add/remove, send order, batch management |
| **RestaurantContext** | Selected restaurant, restaurant-scoped storage keys |
| **LocationContext** | User location for delivery |
| **ThemeContext** | Dark/light mode toggle |

### Data Flow

```
User Action → Context Dispatch → AsyncStorage (local persistence)
                                → Supabase (remote persistence)
```

- **Cart data**: Persisted to AsyncStorage, scoped by restaurant ID
- **Orders**: Saved to Supabase `eat_easy_orders` on checkout
- **Coupons**: Managed in Supabase `eat_easy_coupons`
- **Recommendations**: Saved to Supabase `recommendations`

---

## Styling

- **NativeWind** (Tailwind CSS for RN) is the primary styling approach
- Custom theme tokens defined in `tailwind.config.js`
- Dark mode uses the `dark:` prefix (e.g., `dark:bg-neutral-900`)
- Custom fonts: DM Sans (headings), Mulish (body)

---

## Animations

All animations use **React Native Reanimated** via wrapper components in `components/animations/reanimated.tsx`:

| Component | Animation |
|-----------|-----------|
| `FadeInView` | Fade in on mount |
| `SlideInUpView` | Slide up + fade |
| `SlideInLeftView` | Slide from left |
| `SlideInRightView` | Slide from right |
| `PopInView` | Zoom in (pop) |
| `ScaleOnPressView` | Press-to-shrink button wrapper |
| `AnimatedProgressBar` | Animated width transition |
