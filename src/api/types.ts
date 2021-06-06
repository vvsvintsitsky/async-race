export type ID = number;

export interface Identifiable {
  id: ID;
}

export interface Car extends Identifiable {
  name: string;
  color: string;
}

export enum CarEngineStatus {
  Stopped = "stopped",
  Started = "started",
  Drive = "drive",
}

export interface CarStatus {
  velocity: number;
  distance: number;
}

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export enum WinnersSortColumns {
  Id = "id",
  Wins = "wins",
  Time = "time",
}

export interface Winner extends Identifiable {
  wins: number;
  time: number;
}

