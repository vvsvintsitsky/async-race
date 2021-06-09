import { EntityBody } from "./api/api";
import { Car, ID } from "./api/types";

import { CarStorage } from "./storage/types";
import { Race } from "./race/types";

import { Track } from "./track/types";
import { Controls } from "./controls/types";

export abstract class App<T> {
  protected abstract createControls(): Controls<T>;

  protected abstract createTrack(): Track<T>;

  protected abstract createRace(car: Car): Race<T>;

  private races: Race<T>[] = [];

  private controls: Controls<T>;

  private track: Track<T>;

  constructor(private carStorage: CarStorage) {
    this.controls = this.createControls();
    this.track = this.createTrack();
  }

  public async init() {
    const cars = await Promise.all(
      this.generateCars().map((car) => this.carStorage.create(car))
    );

    this.races = cars.map((car) => this.createRace(car));
    this.track.setRaces(this.races);
  }

  public render() {
    return { controls: this.controls.render(), track: this.track.render() };
  }

  protected async startRace() {
    await this.init();
    this.controls.disable();
    this.races.forEach((race) => {
      race.startRace();
    });
  }

  protected onRaceEnd = async (id: ID) => {
    this.races.forEach((race) => {
      race.dispose();
    });
    this.races = [];
    const winner = await this.carStorage.getById(id);
    alert(`${winner.name} won`);
    this.controls.enable();
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
