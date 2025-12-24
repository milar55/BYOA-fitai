import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MealType } from '@/types/meal';

interface MealTypeOption {
  type: MealType;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const MEAL_TYPES: MealTypeOption[] = [
  { type: 'breakfast', label: 'Breakfast', icon: 'coffee', color: '#FF9933' },
  { type: 'lunch', label: 'Lunch', icon: 'food-apple', color: '#FFC107' },
  { type: 'dinner', label: 'Dinner', icon: 'food-variant', color: '#00BFA5' },
  { type: 'snack', label: 'Snack', icon: 'cookie', color: '#D32F2F' },
];

interface MealTypePickerProps {
  selectedType: MealType;
  onSelect: (type: MealType) => void;
}

export function MealTypePicker({ selectedType, onSelect }: MealTypePickerProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {MEAL_TYPES.map((item) => {
        const isSelected = selectedType === item.type;
        return (
          <TouchableOpacity
            key={item.type}
            onPress={() => onSelect(item.type)}
            activeOpacity={0.7}
            className={`w-[48%] flex-row items-center p-4 rounded-2xl border-2 ${
              isSelected ? 'bg-cardamomCream border-saffron' : 'bg-white border-transparent shadow-sm'
            }`}
          >
            <View 
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
            </View>
            <Text 
              className={`font-poppins-semibold text-sm ${
                isSelected ? 'text-deepTeal' : 'text-deepTeal/60'
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function getSmartDefaultMealType(): MealType {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 16) return 'lunch';
  if (hour >= 16 && hour < 22) return 'dinner';
  return 'snack';
}

