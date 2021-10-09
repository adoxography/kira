import Deferred from './deferred';

class AsyncQueue<T> {
  deferredObjects: Array<Deferred<T>>;

  constructor() {
    this.deferredObjects = [];
  }

  /**
   * Pushes a new deferred task onto the queue
   *
   * @param {() => Promise} task An asynchronous task to run
   * @returns {Promise} A promise that resolves to the resolution of the task
   */
  push(task: () => Promise<T>): Promise<T> {
    const deferred = new Deferred<T>(task);
    this.deferredObjects.push(deferred);
    return deferred.promise;
  }

  /**
   * Clears the queue and destroys any existing tasks.
   *
   * @param {?Error} signal An optional signal to pass to the destroyed tasks
   */
  clear(signal: Error | null = null): void {
    this.deferredObjects.forEach(deferred => {
      deferred.destroy(signal);
    });

    this.deferredObjects = [];
  }
}

export default AsyncQueue;
