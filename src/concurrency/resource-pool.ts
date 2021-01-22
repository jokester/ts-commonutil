/**
 * A resource pool to ensure mutex-ed access to resources
 * This pool is "fair": tasks {queue}-ed earlier get started earlier
 *
 * - NOT supported: replace / refresh / timeout of tasks
 */
export class ResourcePool<T> {
  // can be used as a mutex
  static single<T>(res: T): ResourcePool<T> {
    return new ResourcePool([res]);
  }

  static multiple<T>(resArray: T[]): ResourcePool<T> {
    return new ResourcePool(resArray);
  }

  private consumers: ((res: T) => void)[] = [];

  private constructor(private readonly resources: T[]) {}

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

  private borrow(): Promise<T> {
    return new Promise<T>(f => {
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
