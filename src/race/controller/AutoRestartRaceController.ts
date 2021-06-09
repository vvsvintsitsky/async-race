import { CarEngineStatus, ID } from "../../api/types";

import { CarStatusStorage } from "../../storage/types";

import { RaceController, RaceView } from "../types";

export class AutoRestartRaceController implements RaceController {
  private isDisposed = false;

  constructor(
    private carId: ID,
    private carStatusStorage: CarStatusStorage,
    private getRaceView: () => RaceView<void>,
    private onRaceEnd: (id: ID) => void
  ) {}

  public async startRace(): Promise<void> {
    if (this.isDisposed) {
      return;
    }

    const { velocity, distance } =
      await this.carStatusStorage.setEngineStatus(
        this.carId,
        CarEngineStatus.Started
      );

    try {
      this.getRaceView().startRace(velocity, distance);
      await this.carStatusStorage.startMovement(this.carId);
      this.endRace();
    } catch (error) {
      this.stopRace();
      this.startRace();
    }
  }

  public dispose() {
    this.isDisposed = true;
    this.getRaceView().dispose();
  }

  private endRace() {
    if (this.isDisposed) {
      return;
    }
    this.stopRace();
    this.onRaceEnd(this.carId);
  }

  private stopRace() {
    this.getRaceView().stopRace();
  }
}
