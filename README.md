# FitAI 🌶️

FitAI is a cross-platform mobile nutrition application designed for South Asian users to log and track meals using AI. Built with React Native (Expo), Supabase, and Google's Gemini Flash 2.5 Vision AI.

## 🎯 Vision
FitAI addresses the gap in existing nutrition apps by specializing in **South Asian cuisine** (Indian, Pakistani, Bangladeshi, and Nepali). Users can log meals simply by taking a photo, which the AI analyzes to estimate calories, protein, carbs, and fat.

## ✨ Key Features
- **AI Meal Analysis:** Powered by Gemini Flash 2.5 to recognize regional dishes (Biryani, Curry, Dal, Momos, etc.).
- **Photo Logging:** Instant nutrition breakdown from camera or gallery.
- **Daily Dashboard:** Track calories and macros against personalized goals.
- **History & Trends:** View past meals and weekly nutritional summaries.
- **Goal Management:** Customizable targets for calories and macronutrients.

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), Expo Router, NativeWind (Tailwind CSS), Reanimated.
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Edge Functions).
- **AI:** Google Gemini Flash 2.5 Vision API.
- **Styling:** "Saffron & Spice" color palette for a vibrant, cultural aesthetic.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Expo Go app on your mobile device
- Supabase account
- Google AI Studio API Key (Gemini)
- Critical: Make sure .env files are encoded in UTC-8 instead of UTF-16 or else expo can't build using those environmental variables. These env variables are also in the expo dahsboard now. 

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd FitAI
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```
4. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 Deployment
FitAI uses **EAS Build** to generate production-ready binaries for iOS and Android directly from any OS (including Windows).

```bash
eas build --platform ios --profile production
```

