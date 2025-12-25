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
        // no-op
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
          // no-op
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
            // no-op
            return false;
          }}
        >
          <Button
            title="Get Started"
            onPress={() => {
              // no-op
              router.push('/(auth)/signup');
            }}
            className="w-full"
          />
          <View
            style={{ pointerEvents: 'box-none' }}
            onStartShouldSetResponder={() => {
              // no-op
              return false;
            }}
            onTouchStart={() => {
              // no-op
            }}
          >
            <Button
              title="Sign In"
              variant="outline"
              onPress={() => {
                // no-op
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

