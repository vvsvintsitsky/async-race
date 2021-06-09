export interface RaceController {
  startRace(): Promise<void>;
  dispose(): void;
}

export interface RaceView<T> {
  startRace(velocity: number, distance: number): void;
  stopRace(): void;
  dispose(): void;
  render(): T;
}

export interface Race<T> {
  startRace(): void;
  dispose(): void;
  render(): T
}
