import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthUser } from '@/hooks/useAuthUser';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { userId, loading } = useAuthUser();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#FF9933" />
      </View>
    );
  }

  if (userId) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}


