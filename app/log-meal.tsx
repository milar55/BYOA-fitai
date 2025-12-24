import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { MealTypePicker, getSmartDefaultMealType } from '@/components/meal/MealTypePicker';
import { analyzeMeal, NutritionAnalysis } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { useAuthUser } from '@/hooks/useAuthUser';
import { MealType } from '@/types/meal';

export default function LogMealScreen() {
  const router = useRouter();
  const { userId } = useAuthUser();
  const { imageUri, imageUrl } = useLocalSearchParams<{ imageUri: string; imageUrl: string }>();

  const [mealType, setMealType] = useState<MealType>(getSmartDefaultMealType());
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const runAnalysis = useCallback(async () => {
    if (!imageUri) return;
    
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await analyzeMeal(imageUri, mealType);
      setAnalysis(result);
      setDescription(result.description);
      setCalories(result.calories.toString());
      setProtein(result.protein.toString());
      setCarbs(result.carbs.toString());
      setFat(result.fat.toString());
    } catch (e: any) {
      Alert.alert('Analysis Failed', e?.message ?? 'Could not analyze meal nutrition.');
    } finally {
      setAnalyzing(false);
    }
  }, [imageUri, mealType]);

  const handleSave = async () => {
    if (!userId || !imageUrl) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('meals').insert({
        user_id: userId,
        image_url: imageUrl,
        meal_type: mealType,
        description: description,
        calories: parseInt(calories),
        protein_g: parseFloat(protein),
        carbs_g: parseFloat(carbs),
        fat_g: parseFloat(fat),
        confidence_score: analysis?.confidence ?? 1.0,
      });

      if (error) throw error;

      Alert.alert('Success', 'Meal logged successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (e: any) {
      Alert.alert('Save Failed', e?.message ?? 'Could not save meal.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-6">
          <View className="flex-row items-center justify-between py-4">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialCommunityIcons name="chevron-left" size={32} color="#0D3B3B" />
            </TouchableOpacity>
            <Text className="text-deepTeal font-poppins-bold text-xl">Log Meal</Text>
            <View className="w-8" />
          </View>

          <Animated.View entering={FadeIn.duration(600)}>
            <View className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg mb-6">
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-inter capitalize">{mealType}</Text>
              </View>
            </View>
          </Animated.View>

          <Text className="text-deepTeal font-poppins-bold text-lg mb-4">Meal Type</Text>
          <MealTypePicker selectedType={mealType} onSelect={setMealType} />

          {!analysis && !analyzing && (
            <Animated.View entering={FadeInDown.delay(200)} className="mt-8">
              <Button
                title="Analyze Nutrition"
                onPress={runAnalysis}
                variant="primary"
                className="py-5"
              />
            </Animated.View>
          )}

          {analyzing && (
            <View className="mt-12 items-center">
              <Animated.View entering={FadeIn} className="items-center">
                <View className="w-16 h-16 rounded-full bg-cardamomCream items-center justify-center mb-4">
                  <MaterialCommunityIcons name="brain" size={32} color="#FF9933" />
                </View>
                <Text className="text-deepTeal font-poppins-semibold text-lg">Analyzing your meal...</Text>
                <Text className="text-deepTeal/40 font-inter text-sm mt-2">Gemini Flash 2.5 is estimating nutrition</Text>
              </Animated.View>
            </View>
          )}

          {analysis && !analyzing && (
            <Animated.View entering={FadeInDown.duration(600)} className="mt-8 mb-12">
              <Text className="text-deepTeal font-poppins-bold text-lg mb-4">Nutrition Analysis</Text>
              
              <Card className="p-6 mb-6">
                <View className="mb-4">
                  <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest mb-1">Description</Text>
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    className="text-deepTeal font-inter text-base"
                  />
                </View>

                <View className="flex-row items-center justify-between py-4 border-t border-deepTeal/5">
                  <View>
                    <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest">Total Calories</Text>
                    <View className="flex-row items-baseline mt-1">
                      <TextInput
                        value={calories}
                        onChangeText={setCalories}
                        keyboardType="numeric"
                        className="text-3xl font-poppins-bold text-saffron"
                      />
                      <Text className="text-deepTeal/60 font-poppins-semibold ml-1">kcal</Text>
                    </View>
                  </View>
                  
                  {analysis.confidence > 0.8 && (
                    <View className="bg-mintChutney/10 px-3 py-1 rounded-full flex-row items-center">
                      <MaterialCommunityIcons name="check-decagram" size={14} color="#00BFA5" />
                      <Text className="text-mintChutney text-[10px] font-poppins-bold ml-1 uppercase">High Confidence</Text>
                    </View>
                  )}
                </View>

                <View className="flex-row justify-between mt-4">
                  <MacroItem label="Protein" value={protein} onChange={setProtein} color="#FF9933" />
                  <MacroItem label="Carbs" value={carbs} onChange={setCarbs} color="#FFC107" />
                  <MacroItem label="Fat" value={fat} onChange={setFat} color="#D32F2F" />
                </View>
              </Card>

              <Button
                title={saving ? 'Saving...' : 'Save Meal Log'}
                onPress={handleSave}
                loading={saving}
                disabled={saving}
                className="mt-4"
              />
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MacroItem({ label, value, onChange, color }: any) {
  return (
    <View className="items-center">
      <Text className="text-deepTeal/40 text-[10px] font-poppins-bold uppercase tracking-widest mb-2">{label}</Text>
      <View className="flex-row items-baseline">
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          className="text-lg font-poppins-bold text-deepTeal"
          style={{ color }}
        />
        <Text className="text-deepTeal/40 font-inter text-[10px] ml-0.5">g</Text>
      </View>
      <View className="w-12 h-1 rounded-full mt-2" style={{ backgroundColor: `${color}20` }}>
        <View className="h-full rounded-full" style={{ backgroundColor: color, width: '60%' }} />
      </View>
    </View>
  );
}

