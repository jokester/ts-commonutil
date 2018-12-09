export interface LoggerType {
  debug(...param: any[]): void;

  info(...param: any[]): void;

  warn(...param: any[]): void;

  error(...param: any[]): void;

  fatal(...param: any[]): void;
}

/**
 *
 * @param verbosity
 */
export function createLogger(verbosity: 3 | 2 | 1 | 0) {
  return {
    // lvl3
    debug(...param: any[]) {
      if (verbosity >= 3) {
        (console.debug || console.info).call(console, "DEBUG", ...param);
      }
    },
    // lvl2
    info(...param: any[]) {
      if (verbosity >= 2) {
        console.info.call(console, "INFO", ...param);
      }
    },
    // lvl1
    warn(...param: any[]) {
      if (verbosity >= 1) {
        console.warn.call(console, "WARN", ...param);
      }
    },
    // lvl0
    error(...param: any[]) {
      if (verbosity >= 0) {
        console.error.call(console, "ERROR", ...param);
      }
    },
    // always
    fatal(...param: any[]) {
      console.error.call(console, "FATAL", ...param);
    },
  };
}

export namespace Logger {
  export const debug = createLogger(3);
  export const normal = createLogger(2);
  export const quiet = createLogger(1);
  export const silent = createLogger(0);
}
