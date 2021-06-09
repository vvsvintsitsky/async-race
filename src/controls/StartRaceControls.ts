import { Controls } from "./types";

export class StartRaceControls implements Controls<HTMLElement> {
  private content = document.createElement("div");
  private startButton = document.createElement("button");

  constructor(onStartRace: () => void) {
    this.startButton.addEventListener("click", onStartRace);
  }

  disable(): void {
    this.startButton.setAttribute(this.getDisabledAttributeName(), "true");
  }

  enable(): void {
    this.startButton.removeAttribute(this.getDisabledAttributeName());
  }

  render() {
    this.content.innerHTML = "";
    const textElement = document.createElement("div");
    textElement.textContent = "Controls section";

    this.startButton.textContent = "start";
    this.content.append(textElement, this.startButton);
    return this.content;
  }

  private getDisabledAttributeName() {
    return "disabled";
  }
}
