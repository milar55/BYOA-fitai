import { Inter_400Regular } from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../assets/styles/global.css';

import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '@/lib/supabase';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  let router: ReturnType<typeof useRouter>;
  try {
    router = useRouter();
  } catch (e: any) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'navctx-2',hypothesisId:'H1',location:'app/_layout.tsx:useRouter',message:'useRouter threw in RootLayoutNav',data:{errMessage:e?.message ?? String(e)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.error('[DBG_NAVCTX] useRouter threw in RootLayoutNav', e);
    throw e;
  }
  const segments = useSegments();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[DBG_AUTH_EVT]', { event, hasSession: !!session, seg0: segments[0] });
      const inAuthGroup = segments[0] === '(auth)';

      if (event === 'SIGNED_OUT') {
        try {
          router.replace('/(auth)/welcome');
        } catch (e: any) {
          console.error('[DBG_NAVCTX] router.replace threw (SIGNED_OUT)', e);
        }
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session && inAuthGroup) {
          // Only redirect if they are currently in the auth screens
          try {
            router.replace('/(tabs)');
          } catch (e: any) {
            console.error('[DBG_NAVCTX] router.replace threw (SIGNED_IN/INITIAL_SESSION)', e);
          }
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="meal-detail/[id]" options={{ title: 'Meal Details', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
