import React from 'react';
import { View, Text, Image, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View
      className="flex-1 bg-white"
      onTouchStart={() => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'app/(auth)/welcome.tsx:root',message:'Root onTouchStart',data:{},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log('[DBG_WELCOME] root onTouchStart');
      }}
    >
      <StatusBar style="dark" />
      
      {/* Hero Section with Gradient Background */}
      <View
        className="h-[60%] w-full overflow-hidden rounded-b-[48px]"
        style={{ pointerEvents: 'box-none' }}
      >
        <LinearGradient
          colors={['#FF9933', '#FFC107', '#00BFA5']}
          className="absolute inset-0"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <SafeAreaView className="flex-1 items-center justify-center p-6">
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="items-center"
          >
            <View className="w-48 h-48 bg-white/20 rounded-full items-center justify-center border-4 border-white/30 backdrop-blur-md">
               <Text className="text-6xl">🍛</Text>
            </View>
            
            <View className="mt-8 items-center">
              <Text className="text-white text-5xl font-poppins-bold tracking-tight">
                FitAI
              </Text>
              <Text className="text-white/90 text-lg font-poppins text-center mt-2 px-8">
                Your AI Nutritionist for South Asian Cuisine
              </Text>
            </View>
          </Animated.View>
        </SafeAreaView>
      </View>

      {/* Action Section */}
      <View
        className="flex-1 p-8 justify-between"
        style={{ pointerEvents: 'box-none' }}
        onTouchStart={() => {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'app/(auth)/welcome.tsx:actionSection',message:'Action section onTouchStart',data:{},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          console.log('[DBG_WELCOME] action section onTouchStart');
        }}
      >
        <Animated.View 
          entering={FadeInUp.delay(400).duration(800)}
          className="mt-4"
        >
          <Text className="text-deepTeal text-3xl font-poppins-bold leading-tight">
            Track your Biryani, Curry, and Dal with a photo.
          </Text>
          <Text className="text-deepTeal/60 text-lg font-inter mt-4 leading-relaxed">
            Personalized nutrition tracking designed for the flavors of South Asia.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          className="gap-y-4 mb-4"
          onStartShouldSetResponder={() => {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3',location:'app/(auth)/welcome.tsx:buttonsContainer',message:'buttons container startShouldSetResponder',data:{},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            console.log('[DBG_WELCOME] buttons container startShouldSetResponder');
            return false;
          }}
        >
          <Button
            title="Get Started"
            onPress={() => {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4',location:'app/(auth)/welcome.tsx:getStarted',message:'Get Started handler called',data:{to:'/(auth)/signup'},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
              console.log('[DBG_WELCOME] Get Started handler -> /(auth)/signup');
              router.push('/(auth)/signup');
            }}
            className="w-full"
          />
          <View
            style={{ pointerEvents: 'box-none' }}
            onStartShouldSetResponder={() => {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'app/(auth)/welcome.tsx:signInWrapper',message:'Sign In wrapper startShouldSetResponder',data:{},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
              console.log('[DBG_WELCOME] Sign In wrapper startShouldSetResponder');
              return false;
            }}
            onTouchStart={() => {
              // #region agent log
              fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H1',location:'app/(auth)/welcome.tsx:signInWrapper',message:'Sign In wrapper onTouchStart',data:{},timestamp:Date.now()})}).catch(()=>{});
              // #endregion
              console.log('[DBG_WELCOME] Sign In wrapper onTouchStart');
            }}
          >
            <Button
              title="Sign In"
              variant="outline"
              onPress={() => {
                // #region agent log
                fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H4',location:'app/(auth)/welcome.tsx:signIn',message:'Sign In handler called',data:{to:'/(auth)/login'},timestamp:Date.now()})}).catch(()=>{});
                // #endregion
                console.log('[DBG_WELCOME] Sign In handler -> /(auth)/login');
                Alert.alert('Debug', 'Sign In onPress fired');
                router.push('/(auth)/login');
              }}
              className="w-full"
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

