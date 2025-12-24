# FitAI - Cross-Platform Nutrition App Development Plan
**Tech Stack:** React Native (Expo) + Supabase + Gemini Flash 2.5  
**Platform:** iOS (deployable from Windows via EAS Build)  

---

## 🎯 Project Vision

FitAI is a mobile nutrition application designed for South Asian users to log their meals by taking photos. The app leverages Google's Gemini Flash 2.5 Vision AI to analyze South Asian cuisine (Indian, Pakistani, Bangladeshi, and Nepali) and estimate nutritional content (calories, protein, carbs, fat). Optimized for diverse regional dishes from across the subcontinent. Users log meals daily to track their nutrition goals throughout the week.

**MVP Features (must have):**
✅ Email/Password authentication  
✅ Camera integration for meal photos  
✅ AI-powered nutrition analysis (Gemini Flash 2.5)  
✅ **South Asian dish recognition** (biryani, curry, dal, etc.)  
✅ Editable Meal logging with nutrition breakdown  
✅ Daily calorie & macro tracking  
✅ Meal history view  
✅ Weekly and Monthly summary dashboard  
✅ Editable nutrition goals  

**Target Audience:** South Asian diaspora (India, Pakistan, Bangladesh, Nepal) and food enthusiasts  
**Key Differentiator:** AI trained to recognize and accurately estimate nutrition for the full spectrum of South Asian dishes across all four countries  

---

## 🛠️ Technology Stack

### Frontend
- **React Native** with **Expo SDK 52+**
  - `expo-camera` for camera access
  - `expo-image-picker` for photo selection
  - `expo-router` (file-based routing)
  - `react-native-reanimated` for smooth animations
  - **NativeWind** (TailwindCSS for React Native) for styling
  - Custom fonts: **Poppins** or **Inter** with Devanagari support

### Backend & Database
- **Supabase**
  - Authentication (Email/Password, Social OAuth)
  - PostgreSQL database with Row Level Security (RLS)
  - Storage for meal photos
  - Edge Functions (Deno/TypeScript) for AI processing

### AI Layer
- **Google Gemini Flash 2.5** with Vision API
  - Optimized for South Asian food recognition
  - Fast, cost-effective vision analysis
  - Nutrition estimation (calories, protein, carbs, fat)
  - Multi-language meal descriptions (English, Hindi, Urdu support)

### Development Environment (Windows Compatible)
- **Node.js 20+** and **npm/yarn**
- **Expo CLI** for development
- **EAS CLI** for cloud builds (iOS builds from Windows)
- **VS Code** with React Native extensions
- **Android Studio** (for Android testing on Windows)
- **Expo Go** app (for instant device testing)

---

## 🎨 Design System

### Color Palette: "Saffron & Spice"
Inspired by South Asian colors—vibrant, warm, and appetizing.

```javascript
// Primary Colors (NativeWind/Tailwind classes)
deepTeal: '#0D3B3B'      // bg-[#0D3B3B] - background
saffron: '#FF9933'        // bg-[#FF9933] - primary accent (Indian flag orange)
turmericGold: '#FFC107'   // bg-[#FFC107] - secondary accent
mintChutney: '#00BFA5'    // bg-[#00BFA5] - success/progress
cardamomCream: '#FFF8E1'  // bg-[#FFF8E1] - cards/surfaces
chilliRed: '#D32F2F'      // bg-[#D32F2F] - warnings/over-target

// Gradients (via LinearGradient from expo-linear-gradient)
heroGradient: ['#FF9933', '#FFC107', '#00BFA5'] // Sunrise gradient
cardGradient: ['#FFFFFF', '#FFF8E1'] // Subtle cream
```

### Typography
- **Headings:** Poppins Bold (32px → 18px)
- **Body:** Inter Regular (16px) - clean, readable
- **Nutrition Values:** Poppins SemiBold (calorie/macro numbers)


### Cultural Design Elements
- **Color Psychology:**
  - Saffron/Orange: Auspicious in Hindu/Sikh cultures (India, Nepal)
  - Green: Islamic significance (Pakistan, Bangladesh)
  - Balance both to be inclusive
- **Iconography:** 
    - Clean line icons for universal appeal
- **Pattern Accents:** 
  - geometric patterns
  - Keep minimal to avoid cultural overload
- **Spacing:** Generous padding for thumbs (mobile-first design)
- **Inclusivity:** Avoid religious symbols; focus on food and wellness

### Motion Principles
- **Camera Transitions:** Quick fade with scale (300ms)
- **Meal Card Reveal:** Staggered slide-up with Reanimated
- **Nutrition Progress:** Smooth fill with spring physics
- **Photo Capture:** Haptic feedback on Android/iOS

---

## 📐 App Architecture

### Project Structure (Expo Router File-Based Routing)
```
FitAI/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── setup-goals.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx (tab navigator)
│   │   ├── index.tsx (Home screen)
│   │   ├── history.tsx
│   │   └── profile.tsx
│   ├── camera.tsx (full-screen camera)
│   ├── meal-detail/[id].tsx (dynamic route)
│   ├── _layout.tsx (root layout)
│   └── +not-found.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── Toast.tsx
│   │   └── LoadingSpinner.tsx
│   ├── home/
│   │   ├── DailyProgressRing.tsx
│   │   ├── MacroBar.tsx
│   │   └── QuickAddMealButton.tsx
│   ├── meal/
│   │   ├── MealCard.tsx
│   │   ├── NutritionBreakdown.tsx
│   │   └── MealTypePicker.tsx
│   └── history/
│       ├── MealList.tsx
│       ├── WeeklySummaryChart.tsx
│       └── DaySection.tsx
├── lib/
│   ├── supabase.ts (Supabase client)
│   ├── gemini.ts (Gemini AI service)
│   ├── image-utils.ts (compression, upload)
│   └── storage.ts (AsyncStorage helpers)
├── hooks/
│   ├── useAuth.ts
│   ├── useMeals.ts
│   ├── useDailySummary.ts
│   └── useCamera.ts
├── types/
│   ├── user.ts
│   ├── meal.ts
│   ├── nutrition.ts
│   └── supabase.ts
├── constants/
│   ├── Colors.ts
│   ├── Layout.ts
│   └── SouthAsianFoods.ts (common dishes for autocomplete)
├── assets/
│   ├── fonts/
│   │   ├── Poppins-Bold.ttf
│   │   ├── Poppins-SemiBold.ttf
│   │   └── Poppins-Regular.ttf
│   ├── images/
│   └── icons/
├── supabase/
│   └── functions/
│       └── analyze-meal/
│           └── index.ts (Gemini Edge Function)
├── app.json (Expo config)
├── package.json
├── tailwind.config.js
└── .env.local
```

### Architecture Pattern: Hooks + Context
- **Screens:** React functional components (in `app/` folder)
- **Components:** Reusable UI components (presentational)
- **Hooks:** Custom hooks for business logic (data fetching, auth)
- **Context:** Auth context, Theme context (global state)
- **Services:** Utility functions (Supabase, Gemini, image processing)

---

## 🚀 Development Phases

### **Phase 1: Foundation **

#### 1.1 Project Setup (Windows)
- [ ] Install Node.js 20+ (LTS) from [nodejs.org](https://nodejs.org)
- [ ] Install Expo CLI: `npm install -g expo-cli eas-cli`
- [ ] Create new Expo project:
  ```bash
  npx create-expo-app@latest FitAI --template tabs
  cd FitAI
  ```
- [ ] Install dependencies:
  ```bash
  npx expo install expo-camera expo-image-picker expo-linear-gradient
  npm install @supabase/supabase-js @react-native-async-storage/async-storage
  npm install nativewind tailwindcss react-native-reanimated
  npm install @google/generative-ai
  ```
- [ ] Set up NativeWind (TailwindCSS):
  ```bash
  npx tailwindcss init
  ```
- [ ] Configure Supabase project at [supabase.com](https://supabase.com)
- [ ] Set up environment variables in `.env`:
  ```
  EXPO_PUBLIC_SUPABASE_URL=your_url
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
  EXPO_PUBLIC_GEMINI_API_KEY=your_key
  ```
- [ ] Configure `app.json` with camera permissions:
  ```json
  {
    "expo": {
      "plugins": [
        [
          "expo-camera",
          {
            "cameraPermission": "Allow FitAI to take photos of your meals for nutrition tracking"
          }
        ],
        [
          "expo-image-picker",
          {
            "photosPermission": "Allow FitAI to access your photo library"
          }
        ]
      ]
    }
  }
  ```
- [ ] Set up `.gitignore` (exclude `.env`, `node_modules/`, `.expo/`)

#### 1.2 Core Infrastructure
- [ ] Create Supabase client (`lib/supabase.ts`):
  ```typescript
  import { createClient } from '@supabase/supabase-js'
  import AsyncStorage from '@react-native-async-storage/async-storage'
  
  export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  )
  ```
- [ ] Create Gemini service (`lib/gemini.ts`) for AI analysis
- [ ] Set up Supabase Storage bucket for meal photos:
  - Create bucket named `meal-photos`
  - Enable public read access (with RLS)
  - Set max file size to 5MB
- [ ] Set up color constants (`constants/Colors.ts`)
- [ ] Install and configure Poppins fonts
- [ ] Design reusable UI components:
  - `Button.tsx` (with loading state, NativeWind styled)
  - `CircularProgress.tsx` (using react-native-svg)
  - `Toast.tsx` (for notifications)
  - `Card.tsx` (meal cards with shadow)

#### 1.3 Database Schema
Create Supabase tables with RLS policies
---

### **Phase 2: Authentication & Onboarding (Week 2-3)**

#### 2.1 Auth UI
- [ ] Design simple onboarding flow (2 screens):
  1. Welcome screen with app value proposition
  2. Nutrition goals setup (daily calorie/macro targets)
- [ ] Implement `LoginView` (Apple Sign-In + Email/Password)
- [ ] Simple signup form with email validation

#### 2.2 Auth Logic
- [ ] `AuthViewModel` with state management:
  - `.unauthenticated`
  - `.loading`
  - `.authenticated(User)`
  - `.error(String)`
- [ ] Supabase Auth integration:
  - Apple Sign-In (required for App Store)
  - Email/Password authentication
  - Session persistence
- [ ] Create protected route wrapper

#### 2.3 User Profile Setup
- [ ] Create `User.swift` model
- [ ] Implement nutrition goals input:
  - Daily calorie target (default: 2000)
  - Protein goal (default: 150g)
  - Carbs goal (default: 250g)
  - Fat goal (default: 65g)
- [ ] Store profile in Supabase `profiles` table

---

### **Phase 3: Core Meal Logging (Week 3-5)**

#### 3.1 Home Dashboard
- [ ] Design today's overview with:
  - Daily calorie progress (circular progress ring)
  - Macro breakdown (protein, carbs, fat) with mini progress bars
  - Meals logged today (breakfast, lunch, dinner, snacks)
  - Large "Log Meal" CTA button
- [ ] Real-time data sync from Supabase
- [ ] Pull-to-refresh functionality
- [ ] Animated progress updates


#### 3.2 Camera & Photo Integration
- [ ] Implement camera capture view:
  - Native camera interface with preview
  - Flash toggle and camera flip
  - Shutter button with haptic feedback
- [ ] App should open to the Log a Meal/camera function as the first screen for the user. 
- [ ] Add photo picker option (for existing photos)
- [ ] Image compression before upload
- [ ] Upload to Supabase Storage
- [ ] Loading state during photo upload

#### 3.3 Meal Type Selection
- [ ] Create meal type picker (bottom sheet):
  - Breakfast (with icon)
  - Lunch (with icon)
  - Dinner (with icon)
  - Snack (with icon)
- [ ] Time-based smart defaults (e.g., morning = breakfast)
- [ ] Smooth sheet animation

#### 3.4 Meal Detail View
This is the core experience—make it beautiful and informative.

- [ ] Display uploaded meal photo (full-width)
- [ ] AI-generated description of the meal (user can edit too)
- [ ] Nutrition card with large calorie display
- [ ] Macro breakdown with visual bars:
  - Protein (with gram amount and %)
  - Carbs (with gram amount and %)
  - Fat (with gram amount and %)
- User can see weekly, monthly trends 
- [ ] Edit/Delete buttons
- [ ] Save to Supabase `meals` table

---

### **Phase 4: AI Nutrition Analysis (Week 5-6)**

#### 4.1 Supabase Edge Function for Gemini Vision AI
Create an Edge Function optimized for South Asian cuisine:

```typescript
// supabase/functions/analyze-meal/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3"

serve(async (req) => {
  const { imageBase64, mealType } = await req.json()
  
  const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
  
  const prompt = `You are a nutrition expert specializing in South Asian cuisine from India, Pakistan, Bangladesh, and Nepal.

Analyze this ${mealType} photo. Identify dishes from across South Asia:

**Indian dishes:** Biryani, butter chicken, paneer tikka, dal makhani, dosa, idli, samosa
**Pakistani dishes:** Nihari, haleem, chapli kebab, karahi, seekh kebab, sajji, aloo keema
**Bangladeshi dishes:** Hilsa fish curry, bhuna khichuri, pitha, shorshe ilish, kacchi biryani
**Nepali dishes:** Dal bhat, momo, gundruk, sel roti, thukpa, chatamari

Common items:
- Rice dishes (biryani, pulao, jeera rice, bhaat)
- Curries (chicken, mutton, fish, paneer, vegetable)
- Breads (roti, naan, paratha, puri, tandoori roti)
- Lentils (dal, daal, parippu)
- Sides (raita, achar, chutney)
- Snacks (samosa, pakora, bhaji, singara)
- Sweets (gulab jamun, jalebi, barfi, rasgulla, ladoo)

Provide accurate nutrition estimates:
1. Detailed description (include specific dish names if recognizable)
2. Total calories, grams and %
3. Protein (grams)
4. Carbs (grams)
5. Fat (grams)

Account for typical South Asian cooking methods (ghee, oil, spices).

Return ONLY valid JSON:
{"description": "", "calories": 0, "protein": 0.0, "carbs": 0.0, "fat": 0.0, "confidence": 0.0}`

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: "image/jpeg"
    }
  }
  
  const result = await model.generateContent([prompt, imagePart])
  const responseText = result.response.text()
  
  // Extract JSON from markdown code blocks if present
  const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/) || 
                    responseText.match(/\{[\s\S]+\}/)
  const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : responseText
  
  const parsed = JSON.parse(jsonStr)
  return new Response(JSON.stringify(parsed))
})
```

#### 4.2 AI Integration in React Native
- [ ] Create `lib/gemini.ts` to call Supabase Edge Function
- [ ] Convert image URI to Base64:
  ```typescript
  import * as FileSystem from 'expo-file-system'
  
  async function imageToBase64(uri: string) {
    return await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64
    })
  }
  ```
- [ ] Handle loading states (animated spinner during analysis)
- [ ] Parse JSON response and type with TypeScript
- [ ] Error handling for failed analyses (show retry button)
- [ ] Fallback for unrecognized foods (manual entry)

#### 4.3 AI Result Display
- [ ] Show analysis results in real-time
- [ ] Confidence badge (High/Medium/Low based on score)
- [ ] Allow manual editing of AI-generated values
- [ ] Add "Re-analyze" button if user disagrees
- [ ] Save final values to database

#### 4.4 AI Optimization Tips
**For best results:**
- Compress images to max 1MB before sending to API
- Use JPEG format (better compression than PNG)
- Include meal type context in prompt (helps accuracy)
- Handle edge cases:
  - Multiple dishes in one photo → estimate combined totals
  - Unclear photos → return low confidence + ask for better photo
  - Non-food items → return error message
- Cache common foods for faster repeated logging

**Expected AI Response Format:**
```json
{
  "description": "Chicken biryani with raita and onion garnish. Rice appears to be basmati with saffron, chicken pieces visible with spices.",
  "calories": 650,
  "protein": 28.0,
  "carbs": 78.0,
  "fat": 22.0,
  "confidence": 0.88
}
```

**Sample Prompts for Testing:**
- "Analyze this lunch photo. It's a typical South Asian thali."
- "What's the nutrition for this chicken biryani portion?"
- "Estimate calories for this dal makhani with 2 rotis."

---

### **Phase 5: History & Progress (Week 6-7)**

#### 5.1 Meal History View
- [ ] Create scrollable meal log (grouped by day)
- [ ] Each day shows:
  - Date header
  - Total calories for the day
  - List of meals with thumbnails
- [ ] Tap meal to see full details
- [ ] Swipe to delete meal
- [ ] Filter by date range (last 7 days, 30 days, all time)

#### 5.2 Weekly Summary
- [ ] Design `WeeklySummaryView` with:
  - 7-day calorie chart (bar graph)
  - Average daily calories
  - Days on target vs over/under
  - Macro averages (protein, carbs, fat)
- [ ] Visual streak indicator (days logged)
- [ ] Best/worst day highlights

#### 5.3 Profile & Settings
- [ ] Simple `ProfileView` with:
  - User name and email
  - Edit nutrition goals button
  - Total meals logged badge
- [ ] Settings screen:
  - Update calorie/macro goals
  - Change password
  - Logout button

---

### **Phase 6: Polish & Testing (Week 7-8)**

#### 6.1 Animations & Microinteractions
- [ ] Smooth progress ring animations for calories
- [ ] Meal card slide-in animations
- [ ] Add haptic feedback on:
  - Photo capture
  - Meal save confirmation
  - Goal achievement
- [ ] Loading skeletons for meal history

#### 6.2 Performance Optimization
- [ ] Lazy load meal images in history
- [ ] Image caching strategy
- [ ] Compress photos before upload (max 1MB)
- [ ] Add database indexes on `meals.user_id` and `meals.logged_at`
- [ ] Test on iPhone 12 minimum

#### 6.3 Error Handling
- [ ] Camera permission denied flow
- [ ] Network error states with retry
- [ ] AI analysis failures (fallback to manual entry)
- [ ] Form validation for nutrition goals
- [ ] Toast notifications for success/errors

#### 6.4 Testing

**General Testing:**
- [ ] Manual testing checklist:
  - [ ] Fresh install → onboarding → first meal log
  - [ ] Take photo → AI analysis → save meal
  - [ ] Edit nutrition goals
  - [ ] View weekly summary
  - [ ] Delete a meal
  - [ ] Logout and login again
- [ ] Test offline behavior

**South Asian Food Testing (Critical for MVP):**
---


---

## 🔒 Security Checklist

- [ ] Enable Row Level Security (RLS) on all Supabase tables
- [ ] Never expose `service_role` key in app (only use `anon` key)
- [ ] Store Gemini API key only in Supabase Edge Functions (never in app)
- [ ] Use `.env` for local development (never commit to Git)
- [ ] Validate image file types before upload (JPEG/PNG only)
- [ ] Limit photo upload size (max 5MB per image)
- [ ] Implement rate limiting on Edge Functions (prevent abuse)
- [ ] Test authentication edge cases (expired tokens, logout)
- [ ] Ensure RLS policies prevent users from accessing other users' meals
- [ ] Add CAPTCHA or rate limiting for signup (prevent spam accounts)

---

## 📦 Dependencies (npm)

Install via npm/yarn:

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-camera": "~16.0.0",
    "expo-image-picker": "~16.0.0",
    "expo-linear-gradient": "~14.0.0",
    "expo-file-system": "~18.0.0",
    "expo-router": "~4.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-reanimated": "~3.16.0",
    "react-native-svg": "15.8.0",
    "@supabase/supabase-js": "^2.39.0",
    "@react-native-async-storage/async-storage": "^2.1.0",
    "@google/generative-ai": "^0.21.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.3.2"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@types/react": "~18.3.0",
    "typescript": "~5.3.3"
  }
}
```

**Installation commands:**
```bash
# Core Expo packages
npx expo install expo-camera expo-image-picker expo-linear-gradient expo-file-system

# Backend & AI
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install @google/generative-ai

# UI & Styling
npm install nativewind tailwindcss@3.3.2
npm install react-native-reanimated react-native-svg
```

---

## 🚢 Deployment Preparation (Windows → iOS)

### EAS Build Setup (Build iOS from Windows!)
- [ ] Create Expo account at [expo.dev](https://expo.dev)
- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure project: `eas build:configure`
- [ ] Create `eas.json`:
  ```json
  {
    "build": {
      "preview": {
        "ios": {
          "simulator": true
        }
      },
      "production": {
        "ios": {
          "distribution": "store"
        }
      }
    }
  }
  ```
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Run first build: `eas build --platform ios --profile production`
  - EAS handles code signing automatically!
  - Build completes in ~10-15 minutes

### App Store Requirements
- [ ] Create App Store Connect record
- [ ] Design app icon (1024x1024, no alpha channel):
  - Use South Asian food imagery (biryani bowl, spices)
  - Vibrant saffron/turmeric colors
  - Avoid generic plate/fork icons
- [ ] Write app description:
  - "AI-powered nutrition tracking for South Asian cuisine"
  - "Accurate calorie tracking for biryani, curry, dal & more"
  - Highlight privacy (data stays secure)
  - Mention Gemini AI technology
- [ ] Take screenshots (6.7", 6.5", 5.5" screens):
  - Home dashboard with progress rings
  - Camera capturing biryani/curry
  - AI analysis results with South Asian dishes
  - Weekly summary charts
- [ ] Create privacy policy (camera, photo access, data storage)

---

## 🌶️ South Asian-Specific Features

### Cultural Adaptations Across South Asia
- **Dish Recognition by Country:**
  - **Indian variations:** Hyderabadi vs Kolkata biryani, North vs South Indian breakfast
  - **Pakistani specialties:** Karachi vs Lahore styles, BBQ vs curry-based dishes
  - **Bangladeshi cuisine:** River fish dishes, mustard-based gravies, rice-centric meals
  - **Nepali staples:** Dal bhat variations, momo types (steamed/fried/jhol), Tibetan influences
  - **Street food:** Pani puri (India), fuchka (Bangladesh), golgappa (Pakistan)
  - **Home cooking:** Dal-chawal, roti-sabzi, tarkari-bhat
  - **Festival foods:** Ladoo, modak (India), sheer khurma (Pakistan), pitha (Bangladesh), sel roti (Nepal)

- **Portion Sizes by Eating Style:**
  - **Thali/Set meals:** Multiple small dishes (common in India/Nepal)
  - **Family-style:** Large shared platters (common in Pakistan/Bangladesh)
  - **Street food:** Smaller portions but dense calories
  - **Restaurant vs home:** Account for commercial oil usage

- **Cooking Methods Across Region:**
  - **Ghee/mustard oil usage:** High in Pakistani/Bangladeshi cooking
  - **Tandoor cooking:** Naan, kebabs (Pakistan/North India)
  - **Steaming:** Momos, idli (Nepal/South India)
  - **Mustard paste:** Bangladeshi fish curries
  - **Deep frying:** Pakoras, samosas, puris (universal)
  - **Slow cooking:** Nihari, haleem (Pakistan), biryani (all)

---

## 🎯 MVP Feature Scope



**Nice to Have (Post-MVP):**
🔄 Barcode scanner for Indian packaged foods  
🔄 Manual meal entry (without photo)  
🔄 Recipe database (South Asian recipes)  
🔄 Multi-language support (Hindi, Urdu, Tamil)  
🔄 Ramadan/fasting mode  
🔄 Regional cuisine filters  
🔄 Social sharing with South Asian community  
🔄 Water/chai tracking  
🔄 Body weight tracking  
🔄 Meal templates (thali combos)  
🔄 Push notifications for meal reminders  

---

## 💡 Key Design Decisions

### Why React Native (Expo) over SwiftUI?
- **Windows Development:** Build iOS apps from Windows using EAS Build
- Faster iteration with hot reload
- Single codebase for iOS + Android (future expansion)
- Expo's managed workflow simplifies deployment
- Large ecosystem of libraries

### Why Supabase over Firebase?
- PostgreSQL is perfect for structured nutrition data
- Built-in storage for meal photos
- Row Level Security keeps user data private
- Edge Functions for serverless AI processing
- Better pricing (generous free tier for MVP)
- Open-source (no vendor lock-in)

### Why Gemini Flash 2.5 over Claude/GPT-4V?
- **Cost-Effective:** 20x cheaper than GPT-4V ($0.075/1M tokens)
- **Fast:** Sub-second response times (critical for UX)
- **Multimodal:** Excellent vision + text understanding
- **Free Tier:** 15 requests/minute free (perfect for MVP)
- Good food recognition (trained on diverse datasets)
- Native JSON mode (structured outputs)

### Why Target South Asian Cuisine?
- **Underserved Market:** Existing apps struggle with curry, biryani, dal
- **Community Need:** Large diaspora wants accurate tracking
- **Competitive Edge:** Specialized AI prompts increase accuracy
- **Cultural Resonance:** Design and language reflect user identity
- **Growth Potential:** 1.8 billion South Asians globally

### Why Expo EAS Build?
- Build iOS apps without owning a Mac
- Cloud-based builds (no local Xcode needed)
- Automatic code signing and provisioning
- TestFlight integration
- $29/month for unlimited builds (or free tier: 30 builds/month)

---

## 📚 Resources

### Documentation
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/vision)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [NativeWind Docs](https://www.nativewind.dev/)

### Design Inspiration
- [Mobbin - Food Apps](https://mobbin.com) (nutrition app patterns)
- [Dribbble: South Asian Food Apps](https://dribbble.com/search/food-app)
- [Indian UI/UX Patterns](https://www.behance.net/search/projects?search=indian+food+app)

### South Asian Food Databases (for reference & validation)
**India:**
- [IFCT 2017](http://www.ifct2017.com/) (Indian Food Composition Tables)
- [NIN India](https://www.nin.res.in/) (National Institute of Nutrition)

**Pakistan:**
- [Pakistan Food Composition Database](https://www.fao.org/infoods/infoods/tables-and-databases/asia/en/) (via FAO/INFOODS)
- Pakistan Council for Science & Technology nutrition data

**Bangladesh:**
- [Bangladesh Food Composition Table](https://www.fao.org/infoods/infoods/tables-and-databases/asia/en/)
- BIRDEM (Bangladesh Institute of Research) nutrition database

**Nepal:**
- [Nepal Food Composition Table 2012](https://www.fao.org/infoods/infoods/tables-and-databases/asia/en/)
- Department of Food Technology and Quality Control (Nepal)

**General:**
- [USDA FoodData](https://fdc.nal.usda.gov/) (includes South Asian ethnic foods)

### Communities
- [Expo Discord](https://chat.expo.dev/)
- [React Native Community](https://github.com/react-native-community)
- [Supabase Discord](https://discord.supabase.com)
- [Google AI Discord](https://discord.gg/google-dev)
- [r/reactnative](https://reddit.com/r/reactnative)

---

## 💻 Key Code Patterns

### Supabase Client Setup
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

### Camera Capture with Expo
```typescript
// hooks/useCamera.ts
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

export function useCamera() {
  const [image, setImage] = useState<string | null>(null)
  
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Camera permission required')
      return
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      aspect: [4, 3],
    })
    
    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  
  return { image, takePhoto }
}
```

### Circular Progress Ring (React Native SVG)
```typescript
// components/ui/CircularProgress.tsx
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Animated, { useAnimatedProps, withSpring } from 'react-native-reanimated'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export function CircularProgress({ progress, size = 120, color = '#FF9933' }) {
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withSpring(circumference * (1 - progress)),
  }))
  
  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E5E5E5"
        strokeWidth={10}
        fill="none"
      />
      <AnimatedCircle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={10}
        fill="none"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  )
}
```

### Upload Image to Supabase Storage
```typescript
// lib/image-utils.ts
import * as FileSystem from 'expo-file-system'
import { supabase } from './supabase'
import { decode } from 'base64-arraybuffer'

export async function uploadMealPhoto(uri: string): Promise<string> {
  // Convert to base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })
  
  // Generate unique filename
  const filename = `${Date.now()}-${Math.random().toString(36)}.jpg`
  const path = `meal-photos/${filename}`
  
  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('meal-photos')
    .upload(path, decode(base64), {
      contentType: 'image/jpeg',
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('meal-photos')
    .getPublicUrl(path)
  
  return publicUrl
}
```

### Call Gemini via Edge Function
```typescript
// lib/gemini.ts
import { supabase } from './supabase'
import * as FileSystem from 'expo-file-system'

interface NutritionAnalysis {
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: number
}

export async function analyzeMeal(
  imageUri: string,
  mealType: string
): Promise<NutritionAnalysis> {
  // Convert image to base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  })
  
  // Call Supabase Edge Function
  const { data, error } = await supabase.functions.invoke('analyze-meal', {
    body: { imageBase64: base64, mealType },
  })
  
  if (error) throw error
  return data as NutritionAnalysis
}
```

---

## 🔥 Next Immediate Actions (Windows Setup)

1. **Install Node.js**  
   → Download Node.js 20 LTS from [nodejs.org](https://nodejs.org)  
   → Verify installation: `node --version` (should show v20.x)

2. **Create Supabase Project**  
   → Go to [supabase.com](https://supabase.com) and create account  
   → Create new project named "FitAI"  
   → Save your `anon` key and project URL  
   → Go to Storage → Create bucket `meal-photos` (public)

3. **Get Gemini API Key**  
   → Go to [aistudio.google.com](https://aistudio.google.com)  
   → Click "Get API Key" → Create new key  
   → Free tier: 15 RPM (perfect for testing)

4. **Create Expo Project**  
   → Open PowerShell/Command Prompt  
   → Run:
   ```bash
   npx create-expo-app@latest FitAI --template tabs
   cd FitAI
   npm install @supabase/supabase-js @react-native-async-storage/async-storage
   npx expo install expo-camera expo-image-picker expo-linear-gradient
   npm install nativewind tailwindcss@3.3.2
   npm install @google/generative-ai
   ```

5. **Set Up Environment Variables**  
   → Create `.env` in project root:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```
   → Never commit `.env` to Git!

6. **Configure Expo for EAS Build**  
   → Install EAS CLI: `npm install -g eas-cli`  
   → Login: `eas login`  
   → Configure project: `eas build:configure`  
   → This creates `eas.json` (for cloud iOS builds)

7. **Test on Your Phone**  
   → Install "Expo Go" app on your iPhone  
   → Run: `npx expo start`  
   → Scan QR code with your iPhone camera  
   → App loads instantly (no Mac needed!)

8. **Set Up Git Repository**  
   → Initialize: `git init`  
   → Create `.gitignore`:
   ```
   node_modules/
   .expo/
   .env
   .env.local
   *.log
   .DS_Store
   ```
   → First commit: `git add . && git commit -m "Initial setup"`

9. **Install VS Code Extensions**  
   → ES7+ React/Redux/React-Native snippets  
   → Tailwind CSS IntelliSense  
   → Prettier - Code formatter

10. **Design First Screen**  
    → Start with login screen  
    → Use "Saffron & Spice" color palette  
    → Add food imagery (biryani, curry, etc.)

---
