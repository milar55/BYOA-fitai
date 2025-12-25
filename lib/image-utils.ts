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
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'upload-0b',hypothesisId:'H1',location:'lib/image-utils.ts:uriToUint8Array',message:'uriToUint8Array entered',data:{uriPrefix:String(uri).slice(0,40)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  console.log('[DBG_UPLOAD] uriToUint8Array entered', { uriPrefix: String(uri).slice(0, 60) });

  // Path A: try fetch(uri) -> blob -> arrayBuffer (works on web; sometimes flaky on iOS file://)
  try {
    const res = await fetch(uri);
    const ok = res.ok;
    const ct = res.headers.get('content-type');
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/888a97b1-a21e-4044-bb22-43b641970785',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'upload-0b',hypothesisId:'H1',location:'lib/image-utils.ts:uriToUint8Array',message:'fetch(uri) completed',data:{ok,status:res.status,contentType:ct},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (ok) {
      const blob = await res.blob();
      // @ts-expect-error Blob.size exists at runtime
      const blobSize = typeof blob?.size === 'number' ? blob.size : null;
      console.log('[DBG_UPLOAD] fetch(uri) blob size', { blobSize, contentType: ct });

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
        console.log('[DBG_UPLOAD] bytes from blob via FileReader', { byteLength: bytes.byteLength });
        return bytes;
      }
    }
  } catch (e: any) {
    console.log('[DBG_UPLOAD] fetch(uri) path failed, falling back to FileSystem', {
      message: e?.message ?? String(e),
    });
  }

  // Path B (fallback): read base64 from FileSystem then decode in JS (reliable on iOS)
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  // @ts-expect-error expo-file-system types vary by version; size exists when requested
  const fileSize = typeof info.size === 'number' ? info.size : null;
  console.log('[DBG_UPLOAD] FileSystem.getInfoAsync', { exists: info.exists, fileSize });

  if (!info.exists) throw new Error('Image file not found on device');

  // Fallback removed for now; FileReader path should cover iOS reliably.
  throw new Error('Could not convert image to bytes (unexpected 0-byte blob).');
}


