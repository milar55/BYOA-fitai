import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Meal, MealType } from '@/types/meal';

function startOfTodayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfTodayIso() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

export function useTodayMeals(userId: string | null) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setMeals([]);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', startOfTodayIso())
      .lte('logged_at', endOfTodayIso())
      .order('logged_at', { ascending: false });

    if (error) {
      // If the table isn't set up yet, show a gentle error (no crash).
      setError(error.message);
      setMeals([]);
    } else {
      setMeals((data as Meal[]) ?? []);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!userId) return;

    // Tear down existing subscription
    channelRef.current?.unsubscribe();

    // Real-time sync (works once `meals` table exists + realtime enabled)
    const ch = supabase
      .channel('meals:today')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meals', filter: `user_id=eq.${userId}` },
        () => {
          // NOTE: keep light; do a refetch for now.
          refetch();
        }
      )
      .subscribe();

    channelRef.current = ch;

    return () => {
      ch.unsubscribe();
    };
  }, [userId, refetch]);

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => {
        acc.calories += m.calories ?? 0;
        acc.protein += m.protein_g ?? 0;
        acc.carbs += m.carbs_g ?? 0;
        acc.fat += m.fat_g ?? 0;
        acc.count += 1;
        acc.byType[m.meal_type] = (acc.byType[m.meal_type] ?? 0) + 1;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        count: 0,
        byType: {} as Record<MealType, number>,
      }
    );
  }, [meals]);

  return { meals, totals, loading, error, refetch };
}


