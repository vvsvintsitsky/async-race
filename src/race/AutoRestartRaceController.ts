import { CarEngineStatus, CarStatus, ID } from "../api/types";

import { CarStatusStorage } from "../storage/types";

import { RaceController, RaceView } from "./types";

export class AutoRestartRaceController implements RaceController {
  private requiredWinPercentage = 100;

  private winTimeoutId?: number;

  private distanceCovered = 0;

  private carStatus?: CarStatus;

  private isDisposed = false;

  constructor(
    private carId: ID,
    private carStatusStorage: CarStatusStorage,
    private raceView: RaceView,
    private onCarStop: (id: ID) => void,
    private onRaceEnd: (id: ID) => void
  ) {}

  public async startRace(): Promise<void> {
    this.clearWinTimeout();

    if (this.isDisposed) {
      return;
    }

    this.carStatus = await this.carStatusStorage.setEngineStatus(
      this.carId,
      CarEngineStatus.Started
    );

    const movementPendingResult = this.carStatusStorage.startMovement(
      this.carId
    );

    this.raceView.startRace();

    const estimatedTimeToEndMilliseconds =
      (this.carStatus.distance - this.distanceCovered) * 1000 /
      this.carStatus.velocity;

    this.winTimeoutId = window.setTimeout(() => {
      this.endRace();
    }, estimatedTimeToEndMilliseconds);

    const movementStartTime = new Date();
    movementPendingResult.catch(() => {
      this.stopRace(movementStartTime);
      this.startRace();
    });
  }

  public dispose() {
    this.clearWinTimeout();
    this.raceView.dispose();
  }

  private clearWinTimeout() {
    clearTimeout(this.winTimeoutId);
  }

  private endRace() {
    this.raceView.stopRace(this.requiredWinPercentage);
    this.onRaceEnd(this.carId);
  }

  private stopRace(movementStartTime: Date) {
    this.onCarStop(this.carId);
    this.distanceCovered =
      this.distanceCovered + this.calculateCoveredDistance(movementStartTime);
    this.raceView.stopRace(this.distanceCovered / this.getCarStatus().distance);
  }

  private getCarStatus() {
    if (!this.carStatus) {
      throw new Error("Car status is not initialized");
    }

    return this.carStatus;
  }

  private calculateCoveredDistance(movementStartTime: Date) {
    return (
      (this.getCarStatus().velocity *
        (movementStartTime.getTime() - new Date().getTime())) /
      1000
    );
  }
}
