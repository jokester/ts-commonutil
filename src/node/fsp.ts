import fsPromised from 'node:fs/promises';
import { chunkToLines } from '../text/chunk-to-lines';

export const readText = (filename: string, encoding: BufferEncoding = 'utf-8'): Promise<string> =>
  fsPromised.readFile(filename, { encoding }) as Promise<string>;

export const readLines = (filename: string): Promise<string[]> => readText(filename).then(chunkToLines);

export const mv = async (oldPath: string, newPath: string): Promise<void> => {
  try {
    return await fsPromised.rename(oldPath, newPath);
  } catch (e) {
    if (e && (e as { code?: unknown }).code === 'EXDEV') {
      /**
       * on "EXDEV: cross-device link not permitted" error
       * fallback to cp + unlink
       */
      await fsPromised.copyFile(oldPath, newPath);
      return await fsPromised.unlink(oldPath);
    } else {
      throw e;
    }
  }
};
