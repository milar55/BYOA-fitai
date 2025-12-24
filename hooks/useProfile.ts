import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/user';

const DEFAULT_GOALS = {
  daily_calorie_goal: 2000,
  protein_goal_g: 150,
  carbs_goal_g: 250,
  fat_goal_g: 65,
};

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      setError(error.message);
      setProfile(null);
    } else {
      setProfile((data as UserProfile) ?? null);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const goals = useMemo(() => {
    return {
      daily_calorie_goal: profile?.daily_calorie_goal ?? DEFAULT_GOALS.daily_calorie_goal,
      protein_goal_g: profile?.protein_goal_g ?? DEFAULT_GOALS.protein_goal_g,
      carbs_goal_g: profile?.carbs_goal_g ?? DEFAULT_GOALS.carbs_goal_g,
      fat_goal_g: profile?.fat_goal_g ?? DEFAULT_GOALS.fat_goal_g,
    };
  }, [profile]);

  return { profile, goals, loading, error, refetch };
}


