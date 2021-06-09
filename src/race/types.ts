export interface RaceController {
  startRace(): Promise<void>;
  dispose(): void;
}

export interface RaceView {
  startRace(): void;
  stopRace(progress: number): void;
  dispose(): void;
}
