import { API_SCHEMA_TYPE } from "../api/api";
import { CarEngineStatus, CarStatus } from "../api/types";

import { sendRequest } from "../request";

import { CarStatusStorage } from "./types";

export class RemoteCarStatusStorage implements CarStatusStorage {
  constructor(
    private schema: API_SCHEMA_TYPE,
    private sendQuery = sendRequest
  ) {}

  public async setEngineStatus(
    id: number,
    status: CarEngineStatus.Stopped | CarEngineStatus.Started
  ) {
    const { body: carStatus } = await this.sendQuery({
      resource: this.schema.SET_CAR_ENGINE_STATUS,
      variables: { queryParams: { id, status } },
    });
    return carStatus;
  }

  public async startMovement(id: number) {
    await this.sendQuery({
      resource: this.schema.START_CAR_MOVING,
      variables: { queryParams: { id, status: CarEngineStatus.Drive } },
    });
  }
}
