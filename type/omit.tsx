export type Omit<A, B extends keyof A> = Pick<A, Exclude<keyof A, B>>;
