/**
 * A resource pool to ensure mutex-ed access to resources
 * This pool is "fair": consumers (tasks) queued earlier start earlier
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
  readonly resourceCount: number;

  private constructor(_resources: readonly T[]) {
    this.resources = _resources.slice();
    this.resourceCount = _resources.length;
  }

  get freeCount(): number {
    return this.resources.length;
  }

  get queueLength(): number {
    return this.consumers.length;
  }

  async use<R>(task: (res: T) => R): Promise<R> {
    const r = await this.borrow();
    try {
      return await task(r);
    } finally {
      this.resources.push(r);
      this.balance();
    }
  }

  tryUse<R>(task: (res: T | null) => R): R | Promise<R> {
    if (/** some resource is immediately available */ this.freeCount > 0) {
      return this.use(task);
    } else {
      return task(null);
    }
  }

  /**
   * Wait until specified condition is met
   * Can be used to wait all queued consumers to finish, or to wait before queueing more tasks.
   * @param condition
   * @param timeout
   * @param precision
   * @return true if the target condition (either) is met, false if timeout
   */
  async wait(
    condition: { freeCount?: number; queueLength?: number },
    timeout = 5e3,
    precision = 0.05e3,
  ): Promise<boolean> {
    const targetFreeCount = condition.freeCount ?? NaN;
    const targetQueueLength = condition.queueLength ?? NaN;
    if (Number.isNaN(targetFreeCount) && Number.isNaN(targetQueueLength)) {
      throw new Error('ResourcePool.wait(): at least 1 of freeCount and queueLength must be specified');
    }
    const start = Date.now();
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.freeCount >= targetFreeCount) {
        return true;
      } else if (this.queueLength <= targetQueueLength) {
        return true;
      } else if (Date.now() > start + timeout) {
        return false;
      } else {
        await wait(precision); // and continue
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
