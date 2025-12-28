import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

export interface NutritionAnalysis {
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

/**
 * Generates an AI meal description (NOT nutrition) via a Supabase Edge Function.
 * This keeps the API key secure on the server.
 */
export async function describeMeal(
  imageUri: string,
  mealType: string,
  imageUrl?: string
): Promise<{ description: string; confidence: number }> {
  try {
    // Call Supabase Edge Function for AI description.
    // Prefer passing the public URL so the server can fetch/encode.
    const body: Record<string, unknown> = imageUrl
      ? { imageUrl, mealType }
      : (() => {
          // Fallback: local base64 (avoid FileSystem.EncodingType.Base64 which is undefined on some runtimes)
          // NOTE: this fallback isn't expected to run when called after upload.
          return { imageBase64: '__will_be_replaced__', mealType };
        })();

    if (!imageUrl) {
      // Convert image to base64 using string literal encoding
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        // @ts-expect-error legacy API supports string encoding
        encoding: 'base64',
      });
      body.imageBase64 = base64;
      delete body.imageUrl;
    }

    const { data, error } = await supabase.functions.invoke('describe-meal', {
      body,
    });

    if (error) {
      // Supabase functions surface non-2xx as an error. If we got quota (429),
      // bubble a clear message to the UI.
      const msg = String((error as any)?.message ?? '');
      const isQuota =
        msg.includes('429') ||
        msg.toLowerCase().includes('resource_exhausted') ||
        msg.toLowerCase().includes('quota');

      if (isQuota) {
        throw new Error('AI is temporarily rate-limited (quota exceeded). Please try again in a minute.');
      }

      console.error('Error invoking describe-meal function:', error);
      throw new Error('Failed to generate AI meal description. Please try again.');
    }

    return data as { description: string; confidence: number };
  } catch (error) {
    console.error('describeMeal error:', error);
    throw error;
  }
}

/**
 * Generates an AI nutrition analysis via a Supabase Edge Function.
 */
export async function analyzeNutrition(
  imageUri: string,
  imageUrl?: string
): Promise<NutritionAnalysis> {
  try {
    const body: Record<string, unknown> = imageUrl
      ? { imageUrl }
      : { imageBase64: '__will_be_replaced__' };

    if (!imageUrl) {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        // @ts-expect-error legacy API supports string encoding
        encoding: 'base64',
      });
      body.imageBase64 = base64;
      delete body.imageUrl;
    }

    const { data, error } = await supabase.functions.invoke('analyze-nutrition', {
      body,
    });

    if (error) {
      const msg = String((error as any)?.message ?? '');
      const isQuota =
        msg.includes('429') ||
        msg.toLowerCase().includes('resource_exhausted') ||
        msg.toLowerCase().includes('quota');

      if (isQuota) {
        throw new Error('AI is temporarily rate-limited (quota exceeded). Please try again in a minute.');
      }

      console.error('Error invoking analyze-nutrition function:', error);
      throw new Error('Failed to generate AI nutrition analysis. Please try again.');
    }

    return data as NutritionAnalysis;
  } catch (error) {
    console.error('analyzeNutrition error:', error);
    throw error;
  }
}
