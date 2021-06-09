import { Race } from "../race/types";
import { Track } from "./types";

import styles from "./GrayRectangleTrack.module.css";

export class GrayRectangleTrack implements Track<HTMLElement> {
    private content = document.createElement("div");

    private races: Race<HTMLElement>[] = [];

    public render() {
        this.content.innerHTML = "";
        this.content.classList.add(styles.track);
        this.races.forEach((race) => {
          const viewElement = race.render();
          viewElement.classList.add(styles.race);
          this.content.append(viewElement);
        });
        return this.content;
    }

    public setRaces(races: Race<HTMLElement>[]) {
        this.races = races;
        this.render();
    }
}