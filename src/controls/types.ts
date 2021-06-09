export interface Controls<T> {
  render(): T;
  disable(): void;
  enable(): void;
}
