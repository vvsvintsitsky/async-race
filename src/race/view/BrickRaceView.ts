import { Car } from "../../api/types";

import { RaceController, RaceView } from "../types";

import styles from "./BrickRaceView.module.css";

export class BrickRaceView implements RaceView<HTMLElement> {
  private rootElement = document.createElement("div");

  private carElement!: HTMLElement;

  constructor(private car: Car, private getController: () => RaceController) {}

  startRace(velocity: number, distance: number): void {
    this.resetCarStyle();
    this.carElement.classList.add(styles.carMovement);
    const timeToFinish = distance / (velocity * 1000);
    this.carElement.classList.add(styles.carMovement);
    this.setCarStyle(
      `${this.getCarDefaultStyle()};--timeToFinish: ${timeToFinish}s; left: 100%;`
    );
  }

  stopRace(): void {
    this.carElement.classList.remove(styles.carMovement);
    this.resetCarStyle();
  }

  dispose(): void {}

  render() {
    this.rootElement.innerHTML = "";
    this.carElement = document.createElement("div");
    this.carElement.classList.add(styles.car);
    this.resetCarStyle();

    this.rootElement.classList.add(styles.container);

    const trackElement = document.createElement("div");
    trackElement.classList.add(styles.track);

    const finishElement = document.createElement("div");
    finishElement.classList.add(styles.finishLine);

    trackElement.append(this.carElement);

    this.rootElement.append(trackElement, finishElement);

    return this.rootElement;
  }

  private resetCarStyle() {
      this.setCarStyle(this.getCarDefaultStyle());
  }

  private setCarStyle(style: string) {
    this.carElement.setAttribute("style", style);
  }

  private getCarDefaultStyle() {
    return `background-color: ${this.car.color};`;
  }
}
