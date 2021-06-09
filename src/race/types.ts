export interface RaceController {
  startRace(): Promise<void>;
  dispose(): void;
}

export interface RaceView {
  startRace(velocity: number, distance: number): void;
  stopRace(): void;
  dispose(): void;
  render(): HTMLElement;
}
