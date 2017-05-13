export { chunkToLines, readFile, readLines } from "./text";

export { logger_normal, logger_silent } from "./logger";

export { liftA2 } from "./transforms";

export function isTruthy(v: any) {
    return !!v;
}

export { DeepReadonly, deepFreeze, freeze } from "./type";

export { MutexResource, MutexResourcePool, ResourceHolder } from "./mutex";

export function deprecate(): never {
    throw new Error("Deprecated");
}