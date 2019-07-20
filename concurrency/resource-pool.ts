/**
 * A resource pool to ensure mutex-ed access to resources
 * This pool is "fair": tasks {queue}-ed earlier get started earlier
 *
 * - NOT supported: replace / refresh / timeout of tasks
 */
export class ResourcePool<T> {
  // can be used as a mutex
  static single<T>(res: T) {
    return new ResourcePool([res]);
  }

  static multiple<T>(resArray: T[]) {
    return new ResourcePool(resArray);
  }

  private consumers: ((res: T) => void)[] = [];
  private readonly initialSize: number;

  private constructor(private readonly resources: T[]) {
    this.initialSize = resources.length;
  }

  get freeCount() {
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

  async tryUse<R>(task: (res: T | null) => Promise<R>): Promise<R> {
    if (/** some resource is immediately available */ this.freeCount > 0) {
      return this.use(task);
    } else {
      return task(null);
    }
  }

  private async borrow(): Promise<T> {
    return new Promise<T>(f => {
      this.consumers.push(f);
      this.balance();
    });
  }

  private balance() {
    while (this.resources.length && this.consumers.length) {
      const r = this.resources.shift()!;
      const c = this.consumers.shift()!;
      c(r);
    }
  }
}
