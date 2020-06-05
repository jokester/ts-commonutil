import * as winston from 'winston';
import * as path from 'path';

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

const format = winston.format;

export function getWinstonLogger(srcFile: string, level: LogLevel = 'info', tag?: string) {
  const relativeSrcFile = path.basename(srcFile);
  const label = tag ? `${relativeSrcFile}-${tag}` : relativeSrcFile;
  return winston.createLogger({
    format: format.combine(
      format.label({ label }),
      format.timestamp(),
      format.splat(),
      format.printf(info => {
        return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
      }),
      // format.prettyPrint(),
      // format.logstash(),
      // format.simple(),
    ),
    transports: [
      new winston.transports.Console({
        // format: winston.format.timestamp(),
      }),
    ],
  });
}
