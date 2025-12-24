import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-2 pb-4">
        <Text className="text-deepTeal/60 font-poppins uppercase tracking-widest text-xs">
          Meals
        </Text>
        <Text className="text-deepTeal font-poppins-bold text-3xl">History</Text>
      </View>

      <View className="px-6 gap-y-4">
        <Card>
          <Text className="text-deepTeal font-poppins-bold text-lg">Today</Text>
          <Text className="text-deepTeal/60 font-inter mt-2">
            No meals logged yet.
          </Text>
        </Card>

        <Card variant="flat">
          <Text className="text-deepTeal font-poppins-bold text-lg">Tip</Text>
          <Text className="text-deepTeal/70 font-inter mt-2">
            Once photo logging is wired up, your meals will appear here with calories and macros.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}


