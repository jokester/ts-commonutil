import { Logger, LogLevelDesc } from 'loglevel';
import { Operator, OperatorFunction, pipe } from 'rxjs';
import { dematerialize, map, materialize } from 'rxjs/operators';

export function tapLog<T>(logger: Logger): OperatorFunction<T, T> {
  return pipe(
    materialize(),
    map((v) => {
      if (v.kind === 'N') {
        logger.info(name, 'next()', v.value);
      } else if (v.kind === 'C') {
        logger.info(name, 'complete()', v.value);
      } else {
        logger.error(name, 'error()', v.value);
      }
      return v;
    }),

    dematerialize(),
  );
}
