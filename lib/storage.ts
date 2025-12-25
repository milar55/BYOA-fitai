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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'upload-0b',hypothesisId:'H1',location:'lib/storage.ts:uploadMealPhoto',message:'Prepared upload bytes',data:{byteLength:bytes.byteLength,pathPrefix:path.slice(0,36)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  console.log('[DBG_UPLOAD] uploadMealPhoto prepared bytes', { byteLength: bytes.byteLength, path });

  if (bytes.byteLength === 0) {
    throw new Error('Upload aborted: image payload is 0 bytes (conversion failed).');
  }

  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  console.log('[DBG_UPLOAD] uploading to supabase', { byteLength: bytes.byteLength, abByteLength: (ab as ArrayBuffer).byteLength });

  const { data: uploadData, error } = await supabase.storage.from('meal-photos').upload(path, ab, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  if (error) {
    console.log('[DBG_UPLOAD] supabase upload error', { message: error.message, name: error.name });
    throw error;
  }
  console.log('[DBG_UPLOAD] supabase upload ok', { uploadData });

  const { data: publicData } = supabase.storage.from('meal-photos').getPublicUrl(path);
  return { path, publicUrl: publicData.publicUrl };
}


