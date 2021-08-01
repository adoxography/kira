class Deferred<T> {
  timeout: ReturnType<typeof setTimeout> | null;

  promise: Promise<T>;

  reject: ((value: Error | null) => void) | null;

  resolve: ((value: T) => void) | null;

  constructor() {
    this.timeout = null;
    this.reject = null;
    this.resolve = null;

    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

export default Deferred;
