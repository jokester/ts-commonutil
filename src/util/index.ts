
export { MutexResource, MutexResourcePool, ResourceHolder } from "./mutex";
export function deprecate(): never {
    throw new Error("Deprecated");
}

