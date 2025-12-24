import React from 'react';
import { Text, View } from 'react-native';
import type { MealType } from '@/types/meal';

const META: Record<MealType, { label: string; emoji: string; tint: string }> = {
  breakfast: { label: 'Breakfast', emoji: '☀️', tint: 'bg-turmericGold/20' },
  lunch: { label: 'Lunch', emoji: '🍛', tint: 'bg-saffron/20' },
  dinner: { label: 'Dinner', emoji: '🌙', tint: 'bg-deepTeal/10' },
  snack: { label: 'Snack', emoji: '🍵', tint: 'bg-mintChutney/20' },
};

export function MealTypeChip({ type, count }: { type: MealType; count: number }) {
  const meta = META[type];
  return (
    <View className={`flex-row items-center px-4 py-3 rounded-2xl ${meta.tint}`}>
      <Text className="text-xl mr-2">{meta.emoji}</Text>
      <View>
        <Text className="text-deepTeal font-poppins-semibold">{meta.label}</Text>
        <Text className="text-deepTeal/60 font-inter text-xs">
          {count} {count === 1 ? 'meal' : 'meals'}
        </Text>
      </View>
    </View>
  );
}


