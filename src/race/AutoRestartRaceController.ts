import { CarEngineStatus, ID } from "../api/types";

import { CarStatusStorage } from "../storage/types";

import { RaceController, RaceView } from "./types";

export class AutoRestartRaceController implements RaceController {
  private isDisposed = false;

  constructor(
    private carId: ID,
    private carStatusStorage: CarStatusStorage,
    private raceView: RaceView,
    private onCarStop: (id: ID) => void,
    private onRaceEnd: (id: ID) => void
  ) {}

  public async startRace(): Promise<void> {
    if (this.isDisposed) {
      return;
    }

    const { velocity, distance } = await this.carStatusStorage.setEngineStatus(
      this.carId,
      CarEngineStatus.Started
    );

    try {
      this.raceView.startRace(velocity, distance);
      await this.carStatusStorage.startMovement(this.carId);
      this.endRace();
    } catch (error) {
      this.stopRace();
      this.startRace();
    }
  }

  public dispose() {
    this.isDisposed = true;
    this.raceView.dispose();
  }

  private endRace() {
    this.raceView.stopRace();
    this.onRaceEnd(this.carId);
  }

  private stopRace() {
    this.onCarStop(this.carId);
    this.raceView.stopRace();
  }
}
