import { EntityBody } from "./api/api";
import { Car, ID } from "./api/types";

import { CarStatusStorage, CarStorage } from "./storage/types";
import { AutoRestartRaceController } from "./race/AutoRestartRaceController";
import { RaceController, RaceView } from "./race/types";
import { LightWeightRaceView } from "./race/view/LightweightRaceView";

import styles from "./App.module.css";

interface Track {
  controller: RaceController;
  view: RaceView;
}

export class App {
  private content = document.createElement("div");

  private tracks: Track[] = [];

  constructor(
    private carStorage: CarStorage,
    private carStatusStorage: CarStatusStorage
  ) {}

  public async init() {
    const cars = await Promise.all(
      this.generateCars().map((car) => this.carStorage.create(car))
    );

    this.tracks = cars.map((car) => {
      const raceView = new LightWeightRaceView(car);
      const raceController = new AutoRestartRaceController(
        car.id,
        this.carStatusStorage,
        raceView,
        (id) => console.log(`car id=${id} stopped`),
        this.onRaceEnd
      );
      return {
        view: raceView,
        controller: raceController,
      };
    });
  }

  public render() {
    this.content.innerHTML = "";
    this.content.classList.add(styles.app);
    this.tracks.forEach((track) => {
      const viewElement = track.view.render();
      viewElement.classList.add(styles.track);
      this.content.append(viewElement);
    });
    return this.content;
  }

  public startRace() {
    this.tracks.forEach((track) => {
      track.controller.startRace();
    });
  }

  private onRaceEnd = async (id: ID) => {
    this.tracks.forEach(({ controller, view }) => {
      controller.dispose();
      view.dispose();
    });
    this.tracks = [];
    const winner = await this.carStorage.getById(id);
    alert(`${winner.name} won`);
  };

  private generateCars(): EntityBody<Car>[] {
    return [
      {
        name: "Renault",
        color: "blue",
      },
      {
        name: "Ford",
        color: "yellow",
      },
    ];
  }
}
