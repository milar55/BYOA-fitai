import * as FileSystem from 'expo-file-system';

export async function getFileSizeBytes(uri: string): Promise<number | null> {
  try {
    const info = await FileSystem.getInfoAsync(uri, { size: true });
    if (!info.exists) return null;
    // @ts-expect-error expo-file-system types vary by version; size exists when requested
    return typeof info.size === 'number' ? info.size : null;
  } catch {
    return null;
  }
}

export async function uriToBlob(uri: string): Promise<Blob> {
  const res = await fetch(uri);
  if (!res.ok) throw new Error(`Failed to read file: ${res.status}`);
  return await res.blob();
}


