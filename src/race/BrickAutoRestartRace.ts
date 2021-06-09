import { Car, ID } from "../api/types";
import { CarStatusStorage } from "../storage/types";
import { AutoRestartRaceController } from "./controller/AutoRestartRaceController";
import { RaceView, RaceController, Race } from "./types";
import { BrickRaceView } from "./view/BrickRaceView";

export class BrickAutoRestartRace implements Race<HTMLElement> {
  private controller: RaceController;

  private view: RaceView<HTMLElement>;

  constructor(
    carStatusStorage: CarStatusStorage,
    car: Car,
    onRaceEnd: (id: ID) => void
  ) {
    this.controller = new AutoRestartRaceController(
      car.id,
      carStatusStorage,
      this.getView,
      onRaceEnd
    );

    this.view = new BrickRaceView(car, this.getController);
  }

  public startRace() {
    this.controller.startRace();
  }

  public render() {
    return this.view.render();
  }

  public dispose() {
    this.controller.dispose();
  }

  private getView = () => {
    return this.view;
  }

  private getController = () => {
    return this.controller;
  }
}
