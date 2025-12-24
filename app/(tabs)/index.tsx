import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Button } from '@/components/ui/Button';
import { MacroBar } from '@/components/home/MacroBar';
import { MealTypeChip } from '@/components/home/MealTypeChip';
import { RecentMealItem } from '@/components/home/RecentMealItem';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useProfile } from '@/hooks/useProfile';
import { useTodayMeals } from '@/hooks/useTodayMeals';
import type { MealType } from '@/types/meal';

export default function HomeScreen() {
  const router = useRouter();
  const { userId, email } = useAuthUser();
  const { profile, goals, error: profileError, refetch: refetchProfile } = useProfile(userId);
  const {
    meals,
    totals,
    error: mealsError,
    refetch: refetchMeals,
    loading: mealsLoading,
  } = useTodayMeals(userId);

  const [refreshing, setRefreshing] = useState(false);

  const calorieProgress = useMemo(() => {
    const goal = Math.max(goals.daily_calorie_goal, 1);
    return Math.min(Math.max(totals.calories / goal, 0), 1);
  }, [goals.daily_calorie_goal, totals.calories]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const mealTypeCounts: Record<MealType, number> = useMemo(
    () => ({
      breakfast: totals.byType.breakfast ?? 0,
      lunch: totals.byType.lunch ?? 0,
      dinner: totals.byType.dinner ?? 0,
      snack: totals.byType.snack ?? 0,
    }),
    [totals.byType]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchProfile(), refetchMeals()]);
    setRefreshing(false);
  }, [refetchMeals, refetchProfile]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="px-6 pt-2 pb-4">
          <Text className="text-deepTeal/60 font-poppins uppercase tracking-widest text-xs">
            Today
          </Text>
          <Text className="text-deepTeal font-poppins-bold text-3xl">
            {greeting}
          </Text>
          <Text className="text-deepTeal/60 font-inter mt-1">
            {profile?.full_name ? `${profile.full_name} · ` : ''}
            {email ?? '—'}
          </Text>
        </View>

        <View className="px-6">
          <LinearGradient
            colors={['#FF9933', '#FFC107', '#00BFA5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-[28px] p-5 overflow-hidden"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-white/80 font-poppins uppercase tracking-widest text-xs">
                  Daily calories
                </Text>
                <Text className="text-white font-poppins-bold text-3xl mt-1">
                  {Math.round(totals.calories)} kcal
                </Text>
                <Text className="text-white/90 font-inter mt-1">
                  of {Math.round(goals.daily_calorie_goal)} kcal goal
                </Text>
                <Text className="text-white/70 font-inter text-xs mt-2">
                  {totals.count} {totals.count === 1 ? 'meal' : 'meals'} logged
                </Text>
              </View>

              <View className="bg-white/15 rounded-full p-3">
                <CircularProgress progress={calorieProgress} size={118} strokeWidth={10} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {(profileError || mealsError) && (
          <View className="px-6 mt-4">
            <Card variant="flat">
              <Text className="text-deepTeal font-poppins-bold">Heads up</Text>
              <Text className="text-deepTeal/70 font-inter mt-2">
                {mealsError
                  ? `Meals: ${mealsError}`
                  : `Profile: ${profileError}`}
              </Text>
              <Text className="text-deepTeal/60 font-inter mt-2 text-xs">
                If you haven’t created the `meals` table yet, this is expected—Home will show empty
                states until Phase 3.3/DB schema is applied.
              </Text>
            </Card>
          </View>
        )}

        <View className="px-6 mt-6">
          <Card>
            <Text className="text-deepTeal font-poppins-bold text-xl">
              Log a meal
            </Text>
            <Text className="text-deepTeal/60 font-inter mt-2">
              Snap your food, let FitAI estimate calories + macros, and tweak if needed.
            </Text>
            <View className="mt-4">
              <Button
                title={mealsLoading ? 'Refreshing…' : 'Log Meal (Camera)'}
                onPress={() => router.push('/(tabs)/camera')}
              />
            </View>
          </Card>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-deepTeal font-poppins-bold text-xl mb-3">
            Meals today
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            <View className="flex-row gap-x-3">
              <MealTypeChip type="breakfast" count={mealTypeCounts.breakfast} />
              <MealTypeChip type="lunch" count={mealTypeCounts.lunch} />
              <MealTypeChip type="dinner" count={mealTypeCounts.dinner} />
              <MealTypeChip type="snack" count={mealTypeCounts.snack} />
            </View>
          </ScrollView>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-deepTeal font-poppins-bold text-xl mb-3">
            Macros
          </Text>
          <Card className="gap-y-4">
            <MacroBar label="Protein" value={totals.protein} goal={goals.protein_goal_g} colorClassName="bg-mintChutney" />
            <MacroBar label="Carbs" value={totals.carbs} goal={goals.carbs_goal_g} colorClassName="bg-saffron" />
            <MacroBar label="Fat" value={totals.fat} goal={goals.fat_goal_g} colorClassName="bg-deepTeal" />
          </Card>
        </View>

        <View className="px-6 mt-6">
          <Text className="text-deepTeal font-poppins-bold text-xl mb-3">
            Recent
          </Text>
          <Card>
            {meals.length === 0 ? (
              <Text className="text-deepTeal/60 font-inter">
                No meals yet today. Tap “Log Meal” to start.
              </Text>
            ) : (
              meals.slice(0, 4).map((m, idx) => (
                <View key={m.id}>
                  <RecentMealItem meal={m} />
                  {idx !== Math.min(meals.length, 4) - 1 && (
                    <View className="h-px bg-cardamomCream" />
                  )}
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
