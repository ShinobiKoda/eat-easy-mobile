<div align="center">
  <img src="./assets/images/icon.png" alt="Eat Easy Logo" width="120" height="120" />
  
  # 🍽️ Eat Easy Mobile

  <p>
    <strong>Your ultimate food ordering companion</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
    <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

---

## ✨ Features

- 🔐 **Secure Authentication** - Sign up, sign in with email/password, OTP verification
- 📱 **Cross-Platform** - Runs on iOS, Android, and Web
- 🎨 **Beautiful UI** - Modern design with NativeWind (Tailwind CSS)
- 🌙 **Theme Support** - Light and dark mode support
- ⚡ **Fast & Responsive** - Smooth animations with Reanimated

## 🛠️ Tech Stack

| Category       | Technology                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Framework**  | ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB) |
| **Language**   | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)                                                                                               |
| **Styling**    | ![NativeWind](https://img.shields.io/badge/NativeWind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                             |
| **Backend**    | ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)                                                                                                     |
| **Navigation** | ![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=flat-square&logo=expo&logoColor=white)                                                                                                   |
| **Validation** | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)                                                                                                                    |
| **Animations** | ![Reanimated](https://img.shields.io/badge/Reanimated-785EF0?style=flat-square&logo=react&logoColor=white)                                                                                                    |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/go) app on your device (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/eat-easy-mobile.git
   cd eat-easy-mobile
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your API keys.

4. **Start the development server**

   ```bash
   npx expo start
   ```

5. **Run on your device**
   - 📱 Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - 🤖 Press `a` to open on Android emulator
   - 🍎 Press `i` to open on iOS simulator
   - 🌐 Press `w` to open in web browser

## 📁 Project Structure

```
eat-easy-mobile/
├── 📂 app/                    # App screens (file-based routing)
│   ├── 📂 (auth)/             # Authentication screens
│   │   ├── CreateAccount.tsx
│   │   ├── SignIn.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── VerifyCode.tsx
│   ├── _layout.tsx            # Root layout
│   ├── index.tsx              # Entry screen
│   └── GetStarted.tsx         # Onboarding
├── 📂 api/                    # Vercel serverless functions
│   └── send-otp.ts            # OTP email sender
├── 📂 assets/                 # Static assets
│   ├── 📂 fonts/              # Custom fonts
│   └── 📂 images/             # Images and icons
├── 📂 components/             # Reusable components
├── 📂 constants/              # App constants
├── 📂 contexts/               # React contexts
├── 📂 hooks/                  # Custom hooks
├── 📂 lib/                    # Utility libraries
├── 📂 schemas/                # Zod validation schemas
└── 📂 supabase/               # Supabase configuration
```

## 📜 Available Scripts

| Command                 | Description                       |
| ----------------------- | --------------------------------- |
| `npm start`             | Start the Expo development server |
| `npm run android`       | Start on Android                  |
| `npm run ios`           | Start on iOS                      |
| `npm run web`           | Start on web                      |
| `npm run lint`          | Run ESLint                        |
| `npm run reset-project` | Reset to a fresh project          |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made using Expo and React Native</p>
  
  <a href="https://github.com/your-username/eat-easy-mobile/stargazers">
    <img src="https://img.shields.io/github/stars/shinobikoda/eat-easy-mobile?style=social" alt="Stars" />
  </a>
</div>
