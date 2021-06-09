import { API_SCHEMA_TYPE, EntityBody, TOTAL_COUNT_HEADER } from "../api/api";
import { Car, ID } from "../api/types";

import { sendRequest } from "../request/sendRequest";

import { CarStorage } from "./types";

export class RemoteCarStorage implements CarStorage {
  private cars = new Map<ID, Car>();

  constructor(
    private schema: API_SCHEMA_TYPE,
    private sendQuery = sendRequest
  ) {}

  public async getById(id: ID) {
    const carFromStore = this.cars.get(id);

    if (carFromStore) {
      return carFromStore;
    }

    const { body: car } = await this.sendQuery({
      resource: this.schema.GET_CAR,
      variables: { pathParams: { ":id": id } },
    });
    this.cars.set(id, car);
    return car;
  }

  public async create(car: EntityBody<Car>) {
    const { body: createdCar } = await this.sendQuery({
      resource: this.schema.CREATE_CAR,
      variables: { body: car },
    });
    this.cars.set(createdCar.id, createdCar);
    return createdCar;
  }

  public async update(id: ID, car: EntityBody<Car>) {
    const { body: updatedCar } = await this.sendQuery({
      resource: this.schema.UPDATE_CAR,
      variables: { body: car, pathParams: { ":id": id } },
    });
    this.cars.set(updatedCar.id, updatedCar);
    return updatedCar;
  }

  public async delete(id: ID) {
    await this.sendQuery({
      resource: this.schema.DELETE_CAR,
      variables: { pathParams: { ":id": id } },
    });
    this.cars.delete(id);
  }

  public async getAll(page: number, limit: number) {
    const { body: cars, headers } = await this.sendQuery({
      resource: this.schema.GET_ALL_CARS,
      variables: { queryParams: { _limit: limit, _page: page } },
    });
    cars.forEach((car) => this.cars.set(car.id, car));
    return {
      data: cars,
      totalRecords: Number(headers.get(TOTAL_COUNT_HEADER)),
    };
  }
}
