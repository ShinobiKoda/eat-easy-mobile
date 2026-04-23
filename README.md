# 🍽️ EatEasy Mobile

A React Native mobile application for seamless food ordering, powered by AI recommendations and built with Expo.

<p align="center">
  <img src="https://img.shields.io/badge/Expo-SDK_52-blue?logo=expo" />
  <img src="https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-FF6F00?logo=google" />
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Smart Assistant** | AI-powered meal recommendations using Google Gemini |
| **Full Menu** | Browse, search, and filter dishes by category |
| **Order Management** | Cart, checkout, order status tracking with live timer |
| **Rewards System** | Weekly milestones, lucky day bonuses, coupon management |
| **Profile** | Editable user profile with stats and security settings |
| **Order History** | View and filter past orders with detail modals |
| **Multi-Restaurant** | Restaurant-scoped carts and order batching |
| **Dark Mode** | Full dark mode support via NativeWind |

---

## 🏗️ Tech Stack

- **Framework**: [Expo](https://expo.dev) (SDK 52) + React Native
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Animations**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Backend**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Storage)
- **AI**: [Google Gemini](https://ai.google.dev/) (gemini-2.5-flash)
- **Images**: [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/)

---

## 📁 Project Structure

```
eat-easy-mobile/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth flow (login, signup)
│   ├── (protected)/              # Authenticated pages
│   │   ├── (virtual_assistant)/  # Smart Assistant flow
│   │   │   ├── ChooseVirtualAssistant.tsx
│   │   │   ├── MakeRecommendations.tsx
│   │   │   ├── RecommendationFirstStep.tsx
│   │   │   ├── RecommendationSecondStep.tsx
│   │   │   ├── RecommendationThirdStep.tsx
│   │   │   ├── Generating.tsx
│   │   │   └── ShowRecommendations.tsx
│   │   ├── FullMenu.tsx
│   │   ├── Help.tsx
│   │   ├── Homepage.tsx
│   │   ├── OrderCheckout.tsx
│   │   ├── OrderHistory.tsx
│   │   ├── OrderStatus.tsx
│   │   ├── Profile.tsx
│   │   ├── Restaurants.tsx
│   │   └── Rewards.tsx
│   └── _layout.tsx               # Root layout with providers
├── components/                   # Reusable UI components
│   ├── animations/               # Reanimated wrappers
│   ├── Checkout/                  # Success & Processing modals
│   ├── dashboard/                # ViewDish, etc.
│   ├── layout/                   # Header, AppLayout, Sidebar
│   └── icons/                    # Custom SVG icons
├── contexts/                     # React context providers
│   ├── OrderContext.tsx
│   ├── RestaurantContext.tsx
│   ├── LocationContext.tsx
│   └── ThemeContext.tsx
├── services/                     # Supabase & API service layers
│   ├── cardService.ts
│   ├── couponService.ts
│   ├── menuService.ts
│   ├── orderService.ts
│   ├── recommendationService.ts
│   └── recommendationHistoryService.ts
├── schemas/                      # Data schemas & hooks
│   └── OrderStatusSchema.ts
├── hooks/                        # Custom React hooks
│   └── useOrder.ts
├── lib/                          # Client configurations
│   ├── Supabase.ts
│   └── geminiClient.ts
├── types/                        # TypeScript type definitions
│   └── index.ts
└── docs/                         # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator, or Expo Go app

### Installation

```bash
# Clone the repository
git clone https://github.com/ShinobiKoda/eat-easy-mobile.git
cd eat-easy-mobile

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your values (see Environment Variables below)

# Start the dev server
npx expo start
```

### Running on Device

```bash
# iOS
npx expo start --ios

# Android
npx expo start --android

# Expo Go (scan QR code)
npx expo start
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (main app - auth, orders, coupons, recommendations)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (menu database - can be same or different project)
EXPO_PUBLIC_SUPABASE_MENU_URL=https://your-menu-project.supabase.co
EXPO_PUBLIC_SUPABASE_MENU_ANON_KEY=your-menu-anon-key

# Google Gemini AI
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# Resend (email service)
RESEND_API_KEY=your-resend-key
```

---

## 📖 Documentation

Detailed documentation is available in the [`docs/`](./docs/) folder:

| Document | Description |
|----------|-------------|
| [Architecture](./docs/architecture.md) | App architecture, navigation, and state management |
| [Services](./docs/services.md) | Backend service layer and Supabase integration |
| [Smart Assistant](./docs/smart-assistant.md) | AI recommendation flow and Gemini integration |

---

## 🧪 Type Checking

```bash
npx tsc --noEmit
```
