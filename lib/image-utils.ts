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

export async function uriToUint8Array(uri: string): Promise<Uint8Array> {
  // Path A: try fetch(uri) -> blob -> arrayBuffer (works on web; sometimes flaky on iOS file://)
  try {
    const res = await fetch(uri);
    const ok = res.ok;
    const ct = res.headers.get('content-type');
    if (ok) {
      const blob = await res.blob();
      // @ts-expect-error Blob.size exists at runtime
      const blobSize = typeof blob?.size === 'number' ? blob.size : null;

      if (blobSize && blobSize > 0) {
        // iOS RN Blob may not implement blob.arrayBuffer(). Use FileReader instead.
        const ab: ArrayBuffer = await new Promise((resolve, reject) => {
          try {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
            reader.readAsArrayBuffer(blob as any);
          } catch (e) {
            reject(e);
          }
        });
        const bytes = new Uint8Array(ab);
        return bytes;
      }
    }
  } catch (e: any) {
  }

  // Path B (fallback): read base64 from FileSystem then decode in JS (reliable on iOS)
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  // @ts-expect-error expo-file-system types vary by version; size exists when requested
  const fileSize = typeof info.size === 'number' ? info.size : null;

  if (!info.exists) throw new Error('Image file not found on device');

  // Fallback removed for now; FileReader path should cover iOS reliably.
  throw new Error('Could not convert image to bytes (unexpected 0-byte blob).');
}


