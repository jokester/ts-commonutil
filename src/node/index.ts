/**
 * Read stream until end
 * @deprecated use 'node:stream/consumers' instead.
 * @see https://nodejs.org/api/webstreams.html#streamconsumersjsonstream
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

/**
 * @deprecated use 'node:fs/promises' instead.
 */
import * as fsp from './fsp';

export { fsp };
