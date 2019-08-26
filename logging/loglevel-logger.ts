import { getLogger as _getLogLevelLogger, Logger, LogLevelDesc } from 'loglevel';

type OurLogger = Pick<Logger, 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'getLevel' | 'setLevel'>;

export function getLogLevelLogger(name: string, level: LogLevelDesc = 'WARN', isProd = false): OurLogger {
  if (isProd) return dummyLogger;
  if (!(name && name.trim()) || name.startsWith('/index')) {
    throw new Error('logger must have a nonempty name. do not use __filename');
  }
  const logger = _getLogLevelLogger(name);
  logger.setLevel(level, false);
  return logger;
}

const dummyLogger: OurLogger = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  setLevel: noop,
  getLevel: () => 5,
};

function noop(): void {}
