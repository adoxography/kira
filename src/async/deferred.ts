class Deferred<T> {
  timeout: ReturnType<typeof setTimeout> | null;

  promise: Promise<T>;

  reject: ((value: Error | null) => void) | null;

  alive: boolean;

  constructor(task: () => Promise<T>) {
    this.reject = null;
    this.timeout = null;
    this.alive = true;

    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.timeout = setTimeout(async () => {
        try {
          resolve(await task());
        } catch (error) {
          reject(error);
        } finally {
          this.alive = false;
        }
      });
    });
  }

  /**
   * Destroys the task and clears the timeout
   *
   * @param {?Error} signal An optional message to throw
   */
  destroy(signal: Error | null): void {
    if (!this.alive) {
      return;
    }

    this.reject?.(signal);

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}

export default Deferred;
