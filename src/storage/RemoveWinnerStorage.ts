import { API_SCHEMA_TYPE, EntityBody, TOTAL_COUNT_HEADER } from "../api/api";
import { Winner, WinnersSortColumns, SortOrder } from "../api/types";

import { sendRequest } from "../request";
import { WinnerStorage } from "./types";

export class RemoveWinnerStorage implements WinnerStorage {
  constructor(
    private schema: API_SCHEMA_TYPE,
    private sendQuery = sendRequest
  ) {}

  getById(id: number): Promise<Winner> {
    throw new Error("Method not implemented.");
  }

  public async create(entity: EntityBody<Winner>): Promise<Winner> {
    const { body: winner } = await this.sendQuery({
      resource: this.schema.CREATE_WINNER,
      variables: {
        body: entity,
      },
    });

    return winner;
  }

  update(id: number, entity: EntityBody<Winner>): Promise<Winner> {
    throw new Error("Method not implemented.");
  }

  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  public async getAll(
    page: number,
    limit: number,
    sortColumn?: WinnersSortColumns,
    sortOrder?: SortOrder
  ): Promise<{ data: Winner[]; totalRecords: number }> {
    const { body: winners, headers } = await this.sendQuery({
      resource: this.schema.GET_ALL_WINNERS,
      variables: {
        queryParams: {
          _limit: limit,
          _page: page + 1,
          _order: sortOrder,
          _sort: sortColumn,
        },
      },
    });
    return {
      data: winners,
      totalRecords: Number(headers.get(TOTAL_COUNT_HEADER)),
    };
  }
}
