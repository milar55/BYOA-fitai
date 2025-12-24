import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!email || !password || !fullName) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      // Navigate to setup goals after successful signup
      router.replace('/(auth)/setup-goals');
    } else {
      // If confirmation is ON but it didn't fail, tell user to check email
      setError('Check your email for a confirmation link!');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-8">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-12 h-12 rounded-full bg-cardamomCream items-center justify-center mb-8"
          >
            <Text className="text-xl">←</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInUp.delay(200).duration(600)}>
            <Text className="text-deepTeal text-4xl font-poppins-bold">Create Account</Text>
            <Text className="text-deepTeal/60 text-lg font-poppins mt-2">
              Start your journey to better nutrition today.
            </Text>
          </Animated.View>

          <View className="mt-8 gap-y-5">
            <View>
              <Text className="text-deepTeal/80 text-sm font-poppins-semibold ml-2 mb-2 uppercase tracking-widest">
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Rahul Kumar"
                className="bg-cardamomCream px-6 py-4 rounded-2xl text-deepTeal font-poppins text-lg border border-transparent focus:border-saffron"
              />
            </View>

            <View>
              <Text className="text-deepTeal/80 text-sm font-poppins-semibold ml-2 mb-2 uppercase tracking-widest">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                className="bg-cardamomCream px-6 py-4 rounded-2xl text-deepTeal font-poppins text-lg border border-transparent focus:border-saffron"
              />
            </View>

            <View>
              <Text className="text-deepTeal/80 text-sm font-poppins-semibold ml-2 mb-2 uppercase tracking-widest">
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                className="bg-cardamomCream px-6 py-4 rounded-2xl text-deepTeal font-poppins text-lg border border-transparent focus:border-saffron"
              />
            </View>

            {error && (
              <Text className="text-chilliRed font-poppins text-center px-4">
                {error}
              </Text>
            )}

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={loading}
              className="mt-4"
            />
            
            <TouchableOpacity onPress={() => router.push('/(auth)/login')} className="mt-4">
              <Text className="text-deepTeal/60 text-center font-poppins">
                Already have an account? <Text className="text-saffron font-poppins-bold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

