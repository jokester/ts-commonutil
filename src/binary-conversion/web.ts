/**
 * reportedly "safest way to concatenate blobs"
 * @param {Blob[]} parts
 * @returns {Promise<ArrayBuffer>}
 */
export function concat(parts: BlobPart[]): Promise<ArrayBuffer> {
  return new Blob(parts).arrayBuffer();
}

export async function readBlob(blob: Blob): Promise<ArrayBuffer> {
  const fr = new FileReader();

  return new Promise<ArrayBuffer>((fulfill, reject) => {
    fr.onload = (ev) => fulfill(fr.result as ArrayBuffer);
    fr.onerror = fr.onabort = reject;
    fr.readAsArrayBuffer(blob);
  });
}
