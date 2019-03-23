/**
 * Read stream until end
 */
export function readStream(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buffers = [] as Buffer[];

    stream.once('end', () => resolve(Buffer.concat(buffers)));

    stream.on('error', reject);

    stream.on('data', (chunk: string | Buffer) => {
      if (Buffer.isBuffer(chunk)) {
        buffers.push(chunk);
      } /* (typeof chunk === "string") */ else {
        buffers.push(Buffer.from(chunk));
      }
    });
  });
}

export { FS, FSType } from './fs';
import { FS, FSType } from './fs';
