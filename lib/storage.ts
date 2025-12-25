import { supabase } from '@/lib/supabase';
import { uriToUint8Array } from '@/lib/image-utils';

export async function uploadMealPhoto(params: {
  uri: string;
  userId: string;
}): Promise<{ path: string; publicUrl: string }> {
  const { uri, userId } = params;

  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}.jpg`;
  const path = `${userId}/${filename}`;

  const bytes = await uriToUint8Array(uri);

  if (bytes.byteLength === 0) {
    throw new Error('Upload aborted: image payload is 0 bytes (conversion failed).');
  }

  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

  const { data: uploadData, error } = await supabase.storage.from('meal-photos').upload(path, ab, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data: publicData } = supabase.storage.from('meal-photos').getPublicUrl(path);
  return { path, publicUrl: publicData.publicUrl };
}


