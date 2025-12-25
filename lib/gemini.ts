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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'desc-2',hypothesisId:'H1',location:'lib/gemini.ts:describeMeal',message:'describeMeal entered',data:{platform:require('react-native').Platform.OS,hasEncodingType:!!(FileSystem as any)?.EncodingType,hasImageUrl:!!imageUrl},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.log('[DBG_AI_DESC] describeMeal entered', {
      platform: require('react-native').Platform.OS,
      hasEncodingType: !!(FileSystem as any)?.EncodingType,
      hasImageUrl: !!imageUrl,
    });

    // Call Supabase Edge Function for AI description.
    // Prefer passing the public URL so the server can fetch/encode.
    const body: Record<string, unknown> = imageUrl
      ? { imageUrl, mealType }
      : (() => {
          // Fallback: local base64 (avoid FileSystem.EncodingType.Base64 which is undefined on some runtimes)
          // NOTE: this fallback isn't expected to run when called after upload.
          console.log('[DBG_AI_DESC] fallback to local base64 (no imageUrl)');
          return { imageBase64: '__will_be_replaced__', mealType };
        })();

    if (!imageUrl) {
      // Convert image to base64 using string literal encoding
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'desc-2',hypothesisId:'H2',location:'lib/gemini.ts:describeMeal',message:'Converting local uri to base64 (fallback)',data:{uriPrefix:String(imageUri).slice(0,40)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
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
      console.error('Error invoking describe-meal function:', error);
      throw new Error('Failed to generate AI meal description. Please try again.');
    }

    return data as { description: string; confidence: number };
  } catch (error) {
    console.error('describeMeal error:', error);
    throw error;
  }
}

