import { spawn, exec, execFile, SpawnOptions, ChildProcess } from 'child_process';
import { chunkToLines } from '../text/chunk-to-lines';

/**
 * Captured output of subprocess
 */
interface SubprocessOutput {
  stderr: string[];
  stdout: string[];
}

/**
 * Result after subprocess finished
 */
interface SubprocessResult {
  stderr: string[];
  stdout: string[];
  exit: number;
  signal: string;
}

/**
 * spawn a subprocess and capture its stdout/stderr/return value
 *
 * rejects if the subprocess could not be spawned
 *
 * TODO change this to a process class
 */
export function getSubprocessOutput(command: string, args: string[] = [], options?: SpawnOptions) {
  return new Promise<SubprocessOutput>((fulfill, reject) => {
    execFile(command, args, options, (error: null | Error, stdout: string | Buffer, stderr: string | Buffer) => {
      if (error) {
        reject(error);
      } else {
        try {
          fulfill({
            stdout: chunkToLines(stdout),
            stderr: chunkToLines(stderr),
          });
        } catch (e) {
          reject(e);
        }
      }
    });
  });
}

export function rejectNonZeroReturn(result: SubprocessResult) {
  if (result.exit !== 0) {
    throw new Error(`subprocess returned non-zero: ${result.exit}`);
  }
  return result;
}
