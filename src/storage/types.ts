import { EntityBody } from "../api/api";
import {
  Car,
  CarEngineStatus,
  CarStatus,
  ID,
  Identifiable,
  SortOrder,
  Winner,
  WinnersSortColumns,
} from "../api/types";

export interface CrudStorage<T extends Identifiable> {
  getById(id: ID): Promise<T>;
  create(entity: EntityBody<T>): Promise<T>;
  update(id: ID, entity: EntityBody<T>): Promise<T>;
  delete(id: ID): Promise<void>;
  getAll(
    page: number,
    limit: number
  ): Promise<{ data: T[]; totalRecords: number }>;
}

export type CarStorage = CrudStorage<Car>;

export interface CarStatusStorage {
  setEngineStatus(
    id: ID,
    status: CarEngineStatus.Started | CarEngineStatus.Stopped
  ): Promise<CarStatus>;
  startMovement(id: ID): Promise<void>;
}

export type WinnerStorage = Omit<CrudStorage<Winner>, "getAll"> & {
  getAll(
    page: number,
    limit: number,
    sortColumn: WinnersSortColumns,
    order: SortOrder
  ): Promise<{ data: Winner[]; totalRecords: number }>;
};
