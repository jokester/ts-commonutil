import { FS } from "./fs";

export function chunkToLines(chunk: string | Buffer) {
    return chunk.toString().split(/\r\n|\r|\n/);
}
