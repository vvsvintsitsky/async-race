import { Race } from "../race/types";

export interface Track<T> {
  render(): T;
  setRaces(races: Race<T>[]): void;
}
