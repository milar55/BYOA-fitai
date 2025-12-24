import React from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  colorClassName?: string; // tailwind bg-*
}

export function MacroBar({
  label,
  value,
  goal,
  colorClassName = 'bg-mintChutney',
}: MacroBarProps) {
  const safeGoal = Math.max(goal, 1);
  const progress = Math.min(Math.max(value / safeGoal, 0), 1);

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: withSpring(progress, { damping: 16, stiffness: 120 }) }],
    };
  }, [progress]);

  return (
    <View>
      <View className="flex-row items-end justify-between">
        <Text className="text-deepTeal/80 font-poppins-semibold">{label}</Text>
        <Text className="text-deepTeal font-poppins-bold">
          {Math.round(value)}g{' '}
          <Text className="text-deepTeal/50 font-poppins">
            / {Math.round(goal)}g
          </Text>
        </Text>
      </View>

      <View className="mt-2 h-3 rounded-full bg-cardamomCream overflow-hidden">
        <Animated.View
          style={[{ transformOrigin: 'left' } as any, fillStyle]}
          className={`h-full rounded-full ${colorClassName}`}
        />
      </View>
    </View>
  );
}


