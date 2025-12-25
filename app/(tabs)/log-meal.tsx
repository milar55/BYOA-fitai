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
import { describeMeal } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { useAuthUser } from '@/hooks/useAuthUser';
import { MealType } from '@/types/meal';

export default function LogMealScreen() {
  const router = useRouter();
  const { userId } = useAuthUser();
  const { imageUri, imageUrl } = useLocalSearchParams<{ imageUri: string; imageUrl: string }>();

  const [mealType, setMealType] = useState<MealType>(getSmartDefaultMealType());
  const [generating, setGenerating] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [description, setDescription] = useState('');
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const onSelectMealType = useCallback(
    (type: MealType) => {
      setMealType(type);
    },
    [router]
  );

  const generateDescription = useCallback(async () => {
    if (!imageUri) return;

    setGenerating(true);
    try {
      const res = await describeMeal(imageUri, mealType, imageUrl);
      setAiConfidence(res.confidence ?? null);
      if (!descriptionTouched) {
        setDescription(res.description ?? '');
      }
    } catch (e: any) {
      Alert.alert('AI description failed', e?.message ?? 'Could not generate an AI meal description.');
    } finally {
      setGenerating(false);
    }
  }, [descriptionTouched, imageUri, imageUrl, mealType]);

  useEffect(() => {
    // Generate immediately after upload → when this screen mounts.
    void generateDescription();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!userId || !imageUrl) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('meals').insert({
        user_id: userId,
        image_url: imageUrl,
        meal_type: mealType,
        description: description,
        // Nutrition not implemented yet; keep schema satisfied with zeros for now.
        calories: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        confidence_score: aiConfidence ?? 0.5,
      });

      if (error) throw error;

      Alert.alert('Success', 'Meal logged successfully!', [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)');
          },
        },
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
          <MealTypePicker selectedType={mealType} onSelect={onSelectMealType} />

          {generating && (
            <View className="mt-12 items-center">
              <Animated.View entering={FadeIn} className="items-center">
                <View className="w-16 h-16 rounded-full bg-cardamomCream items-center justify-center mb-4">
                  <MaterialCommunityIcons name="brain" size={32} color="#FF9933" />
                </View>
                <Text className="text-deepTeal font-poppins-semibold text-lg">Creating AI meal description…</Text>
                <Text className="text-deepTeal/40 font-inter text-sm mt-2">Identifying dishes + portion context</Text>
              </Animated.View>
            </View>
          )}

          {!generating && (
            <Animated.View entering={FadeInDown.duration(600)} className="mt-8 mb-12">
              <View className="bg-cardamomCream/50 p-4 rounded-3xl border border-saffron/20 mb-6">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons name="sparkles" size={20} color="#FF9933" />
                  <Text className="text-deepTeal font-poppins-bold ml-2">AI meal description</Text>
                </View>
                <TextInput
                  value={description}
                  onChangeText={(t) => {
                    setDescriptionTouched(true);
                    setDescription(t);
                  }}
                  placeholder="e.g., Chicken biryani with raita and onions"
                  multiline
                  className="text-deepTeal font-inter text-base leading-relaxed"
                />
                {aiConfidence !== null && (
                  <Text className="text-deepTeal/50 font-inter text-xs mt-2">
                    Confidence: {Math.round(aiConfidence * 100)}%
                  </Text>
                )}
              </View>

              <Button
                title={descriptionTouched ? 'Re-generate description (overwrites)' : 'Re-generate description'}
                variant="outline"
                onPress={() => {
                  setDescriptionTouched(false);
                  void generateDescription();
                }}
              />

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
