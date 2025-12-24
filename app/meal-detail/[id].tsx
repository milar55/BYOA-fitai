import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { Meal } from '@/types/meal';

export default function MealDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMeal();
  }, [id]);

  const fetchMeal = async () => {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMeal(data);
    } catch (e: any) {
      Alert.alert('Error', 'Could not load meal details.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              const { error } = await supabase.from('meals').delete().eq('id', id);
              if (error) throw error;
              router.replace('/(tabs)/history');
            } catch (e: any) {
              Alert.alert('Error', 'Could not delete meal.');
            } finally {
              setDeleting(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#FF9933" size="large" />
      </View>
    );
  }

  if (!meal) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="chevron-left" size={32} color="#0D3B3B" />
          </TouchableOpacity>
          <Text className="text-deepTeal font-poppins-bold text-xl">Meal Detail</Text>
          <TouchableOpacity onPress={handleDelete}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        <Animated.View entering={FadeIn.duration(600)}>
          <View className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg mb-6">
            <Image source={{ uri: meal.image_url }} className="w-full h-full" resizeMode="cover" />
            <View className="absolute bottom-4 right-4 bg-black/50 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-inter capitalize">{meal.meal_type}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600)}>
          <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest mb-1">
            {new Date(meal.logged_at).toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          
          <Card className="p-6 mb-6">
            <Text className="text-deepTeal font-inter text-base mb-6">
              {meal.description}
            </Text>

            <View className="flex-row items-center justify-between py-4 border-t border-deepTeal/5">
              <View>
                <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest">Total Calories</Text>
                <View className="flex-row items-baseline mt-1">
                  <Text className="text-4xl font-poppins-bold text-saffron">{meal.calories}</Text>
                  <Text className="text-deepTeal/60 font-poppins-semibold ml-1">kcal</Text>
                </View>
              </View>
              
              <View className="items-end">
                <Text className="text-deepTeal/40 text-xs font-poppins uppercase tracking-widest mb-1">Confidence</Text>
                <View className={`px-3 py-1 rounded-full flex-row items-center ${meal.confidence_score > 0.8 ? 'bg-mintChutney/10' : 'bg-turmericGold/10'}`}>
                  <MaterialCommunityIcons 
                    name={meal.confidence_score > 0.8 ? 'check-decagram' : 'alert-decagram'} 
                    size={14} 
                    color={meal.confidence_score > 0.8 ? '#00BFA5' : '#FFC107'} 
                  />
                  <Text 
                    className="text-[10px] font-poppins-bold ml-1 uppercase"
                    style={{ color: meal.confidence_score > 0.8 ? '#00BFA5' : '#FFC107' }}
                  >
                    {Math.round(meal.confidence_score * 100)}% Match
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between mt-4">
              <MacroDisplay label="Protein" value={meal.protein_g} color="#FF9933" />
              <MacroDisplay label="Carbs" value={meal.carbs_g} color="#FFC107" />
              <MacroDisplay label="Fat" value={meal.fat_g} color="#D32F2F" />
            </View>
          </Card>

          <Button
            title="Edit Details"
            variant="outline"
            onPress={() => Alert.alert('Coming Soon', 'Manual editing of logs is coming in the next update.')}
            className="mb-12"
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MacroDisplay({ label, value, color }: any) {
  return (
    <View className="items-center">
      <Text className="text-deepTeal/40 text-[10px] font-poppins-bold uppercase tracking-widest mb-2">{label}</Text>
      <View className="flex-row items-baseline">
        <Text className="text-lg font-poppins-bold" style={{ color }}>{Math.round(value)}</Text>
        <Text className="text-deepTeal/40 font-inter text-[10px] ml-0.5">g</Text>
      </View>
      <View className="w-12 h-1 rounded-full mt-2" style={{ backgroundColor: `${color}20` }}>
        <View className="h-full rounded-full" style={{ backgroundColor: color, width: '60%' }} />
      </View>
    </View>
  );
}

