export function duplicateArrayBuffer(src: ArrayBuffer | SharedArrayBuffer): ArrayBuffer {
  const dst = new ArrayBuffer(src.byteLength);
  new Uint8Array(dst).set(new Uint8Array(src));
  return dst;
}
