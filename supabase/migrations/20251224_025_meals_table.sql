-- Phase 3: Meals table and RLS
-- Run this in Supabase SQL Editor

CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');

CREATE TABLE IF NOT EXISTS public.meals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  image_url text NOT NULL,
  meal_type public.meal_type NOT NULL,
  description text,
  calories integer NOT NULL,
  protein_g numeric(10, 2) NOT NULL,
  carbs_g numeric(10, 2) NOT NULL,
  fat_g numeric(10, 2) NOT NULL,
  confidence_score numeric(3, 2) NOT NULL DEFAULT 1.0,
  logged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own meals"
ON public.meals FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own meals"
ON public.meals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
ON public.meals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
ON public.meals FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meals_user_id ON public.meals (user_id);
CREATE INDEX IF NOT EXISTS idx_meals_logged_at ON public.meals (logged_at);

-- Update trigger
CREATE TRIGGER set_meals_updated_at
BEFORE UPDATE ON public.meals
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

