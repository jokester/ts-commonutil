import { readStream } from '../util/io';

export { infer } from './infer';
export { format } from './format';

import { infer } from './infer';
import { format } from './format';

module Main {

    export async function main() {
        try {
            process.stdout.write("input a json-decodeable value:\n");

            const stdinBuffer = await readStream(process.stdin);
            const stdinStr = stdinBuffer.toString();

            const jsValue = JSON.parse(stdinStr);
            const tsType = infer(jsValue);

            const lines = format(tsType.generateCode(), 4);
            process.stdout.write(lines.join("\n") + "\n");
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }
}

if (require.main === module) {
    Main.main();
}