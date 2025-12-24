import React from 'react';
import { Text, View } from 'react-native';
import type { Meal } from '@/types/meal';

export function RecentMealItem({ meal }: { meal: Meal }) {
  return (
    <View className="flex-row items-center justify-between py-3">
      <View className="flex-1 pr-3">
        <Text className="text-deepTeal font-poppins-semibold" numberOfLines={1}>
          {meal.description || 'Meal'}
        </Text>
        <Text className="text-deepTeal/50 font-inter text-xs mt-0.5">
          {meal.meal_type.toUpperCase()}
        </Text>
      </View>
      <Text className="text-deepTeal font-poppins-bold">
        {Math.round(meal.calories)} kcal
      </Text>
    </View>
  );
}


