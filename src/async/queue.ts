import Deferred from './deferred';

class AsyncQueue<T> {
  deferredObjects: Array<Deferred<T>>;

  constructor() {
    this.deferredObjects = [];
  }

  clear(signal: Error | null = null): void {
    this.deferredObjects.forEach(deferred => {
      if (deferred.reject) {
        deferred.reject(signal);
      }

      if (deferred.timeout) {
        clearTimeout(deferred.timeout);
      }
    });

    this.deferredObjects = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  push(task: () => any): Promise<T> {
    const deferred = new Deferred<T>();
    deferred.timeout = setTimeout(() => deferred.resolve && deferred.resolve(task()));

    this.deferredObjects.push(deferred);
    return deferred.promise;
  }
}

export default AsyncQueue;
