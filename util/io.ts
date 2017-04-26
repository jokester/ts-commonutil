/**
 * Read stream until end
 */
export function readStream(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        let buffers = [] as Buffer[];

        stream.once('end', () => resolve(Buffer.concat(buffers)));

        stream.on('error', reject);

        stream.on('data', (chunk: string | Buffer) => {
            if (Buffer.isBuffer(chunk))
                buffers.push(chunk);
            else if (typeof chunk === "string")
                buffers.push(Buffer.from(chunk));
            else {
                reject(new Error("data not recognized"));
            }
        });
    });
}