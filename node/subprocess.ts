import { execFile, ExecFileOptions } from 'child_process';
import { chunkToLines } from '../text/chunk-to-lines';

/**
 * Result after subprocess finished
 */
interface SubprocessOutput {
  stderr: string[];
  stdout: string[];
}

/**
 * spawn a subprocess and capture its stdout/stderr
 *
 * rejects on (spawn error) or (non-zero exit code)
 */
export function getSubprocessOutput(command: string, args: string[] = [], options?: ExecFileOptions) {
  return new Promise<SubprocessOutput>((fulfill, reject) => {
    execFile(command, args, options, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }

      try {
        fulfill({
          stdout: chunkToLines(stdout),
          stderr: chunkToLines(stderr),
        });
      } catch (e) {
        reject(e);
      }
    });
  });
}

/**
 * @param result
 * @deprecated getSubprocessOutput already rejects on non-zero exit code
 */
export function rejectNonZeroReturn(result: PromiseLike<SubprocessOutput>): PromiseLike<SubprocessOutput> {
  return result;
}
