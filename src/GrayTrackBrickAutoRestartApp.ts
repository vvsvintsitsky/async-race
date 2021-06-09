import { Car, ID } from "./api/types";

import { CarStatusStorage, CarStorage } from "./storage/types";
import { Race } from "./race/types";
import { Track } from "./track/types";
import { GrayRectangleTrack } from "./track/GrayRectangleTrack";
import { BrickAutoRestartRace } from "./race/BrickAutoRestartRace";
import { Controls } from "./controls/types";
import { StartRaceControls } from "./controls/StartRaceControls";

import { App } from "./App";

export class GrayTrackBrickAutoRestartApp extends App<HTMLElement> {
  constructor(
    carStorage: CarStorage,
    private carStatusStorage: CarStatusStorage
  ) {
    super(carStorage);
  }

  protected createTrack(): Track<HTMLElement> {
    return new GrayRectangleTrack();
  }

  protected createRace(car: Car): Race<HTMLElement> {
    return new BrickAutoRestartRace(this.carStatusStorage, car, (id: ID) =>
      this.onRaceEnd(id)
    );
  }

  protected createControls(): Controls<HTMLElement> {
    return new StartRaceControls(() => this.startRace());
  }
}
