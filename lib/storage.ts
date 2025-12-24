import { supabase } from '@/lib/supabase';
import { uriToBlob } from '@/lib/image-utils';

export async function uploadMealPhoto(params: {
  uri: string;
  userId: string;
}): Promise<{ path: string; publicUrl: string }> {
  const { uri, userId } = params;

  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.jpg`;
  const path = `${userId}/${filename}`;

  const blob = await uriToBlob(uri);

  const { error } = await supabase.storage.from('meal-photos').upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from('meal-photos').getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}


