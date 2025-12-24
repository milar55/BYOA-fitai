import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { Card } from '@/components/ui/Card';

const GoalInput = ({ label, value, onChange, unit, delay }: any) => (
  <Animated.View entering={FadeInRight.delay(delay).duration(600)}>
    <Card className="flex-row items-center justify-between p-4 mb-4">
      <View>
        <Text className="text-deepTeal text-lg font-poppins-semibold">{label}</Text>
        <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest">Target per day</Text>
      </View>
      <View className="flex-row items-center">
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          className="text-2xl font-poppins-bold text-saffron mr-2 w-16 text-right"
        />
        <Text className="text-deepTeal/60 font-poppins-semibold">{unit}</Text>
      </View>
    </Card>
  </Animated.View>
);

export default function SetupGoalsScreen() {
  const router = useRouter();
  const [calories, setCalories] = useState('2000');
  const [protein, setProtein] = useState('150');
  const [carbs, setCarbs] = useState('250');
  const [fat, setFat] = useState('65');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveGoals = async () => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        daily_calorie_goal: parseInt(calories),
        protein_goal_g: parseInt(protein),
        carbs_goal_g: parseInt(carbs),
        fat_goal_g: parseInt(fat),
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.replace('/(tabs)');
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
          <Animated.View entering={FadeInUp.duration(600)}>
            <Text className="text-deepTeal text-4xl font-poppins-bold">Your Goals</Text>
            <Text className="text-deepTeal/60 text-lg font-poppins mt-2">
              Let's set your daily nutrition targets. You can always change these later.
            </Text>
          </Animated.View>

          <View className="mt-10">
            <GoalInput 
              label="Calories" 
              value={calories} 
              onChange={setCalories} 
              unit="kcal" 
              delay={200}
            />
            <GoalInput 
              label="Protein" 
              value={protein} 
              onChange={setProtein} 
              unit="g" 
              delay={300}
            />
            <GoalInput 
              label="Carbohydrates" 
              value={carbs} 
              onChange={setCarbs} 
              unit="g" 
              delay={400}
            />
            <GoalInput 
              label="Fats" 
              value={fat} 
              onChange={setFat} 
              unit="g" 
              delay={500}
            />

            {error && (
              <Text className="text-chilliRed font-poppins text-center mb-4">
                {error}
              </Text>
            )}

            <Button
              title="Save & Continue"
              onPress={handleSaveGoals}
              loading={loading}
              className="mt-6"
            />
            
            <TouchableOpacity onPress={() => router.replace('/(tabs)')} className="mt-4">
              <Text className="text-deepTeal/40 text-center font-poppins text-sm">
                Skip for now (uses defaults)
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

