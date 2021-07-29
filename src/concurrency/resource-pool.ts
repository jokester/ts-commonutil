/**
 * A resource pool to ensure mutex-ed access to resources
 * This pool is "fair": tasks {queue}-ed earlier get started earlier
 *
 * - NOT supported: replace / refresh / timeout of tasks
 */
import { wait } from './timing';

export class ResourcePool<T> {
  // can be used as a mutex
  static single<T>(res: T): ResourcePool<T> {
    return new ResourcePool([res]);
  }

  static multiple<T>(resArray: T[]): ResourcePool<T> {
    return new ResourcePool(resArray);
  }

  private consumers: ((res: T) => void)[] = [];

  /**
   * (free) resource objects
   */
  private readonly resources: T[] = [];
  private readonly resourceCount: number;

  private constructor(_resources: readonly T[]) {
    this.resources = _resources.slice();
    this.resourceCount = _resources.length;
  }

  get freeCount(): number {
    return this.resources.length;
  }

  async use<R>(task: (res: T) => Promise<R>): Promise<R> {
    const r = await this.borrow();
    try {
      return await task(r);
    } finally {
      this.resources.push(r);
      this.balance();
    }
  }

  tryUse<R>(task: (res: T | null) => Promise<R>): Promise<R> {
    if (/** some resource is immediately available */ this.freeCount > 0) {
      return this.use(task);
    } else {
      return task(null);
    }
  }

  async waitComplete(timeout = 5e3, precision = 0.05e3): Promise<boolean> {
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const noOtherTasks = await this.use(
        async () =>
          this.freeCount === this.resourceCount - /* except the one running task */ 1 && this.consumers.length === 0,
      );
      if (noOtherTasks) {
        return true;
      } else if (Date.now() > start + timeout) {
        return false;
      } else {
        await wait(precision);
        // and continue
      }
    }
  }

  private borrow(): Promise<T> {
    return new Promise<T>((f) => {
      this.consumers.push(f);
      this.balance();
    });
  }

  private balance(): void {
    while (this.resources.length && this.consumers.length) {
      const r = this.resources.shift()!;
      const c = this.consumers.shift()!;
      c(r);
    }
  }
}
