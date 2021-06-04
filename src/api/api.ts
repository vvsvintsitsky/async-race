import { ID, Winner, WinnersSortColumns, SortOrder, Car, CarEngineStatus } from "./types";

const API_BASE = "/";

export enum RequestMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
}

export interface RequestResource {
    method: RequestMethod;
    url: string;
}

export interface RequestResource {
    method: RequestMethod;
    url: string;
}

export type Params = Record<string, string | number>;

export interface RequestTypes<Body = void, PathParams = void, QueryParams = void> {
    body: Body;
    pathParams: PathParams;
    queryParams: QueryParams;
}

export interface ResponseTypes<Body = void, ResponseHeaders = void> {
    body: Body;
    headers: ResponseHeaders | Headers;
    status: number;
}

export interface Query<Req, Res> extends RequestResource { }

type TOTAL_COUNT_HEADER = "X-Total-Count"

export type API_SCHEMA_TYPE = {
    GET_ALL_CARS: Query<RequestTypes<void, void, { _page: number }>, ResponseTypes<Car[]>>
    | Query<RequestTypes<void, void, { _page: number, _limit: number }>, ResponseTypes<Car[], { get(headerName: TOTAL_COUNT_HEADER): number }>>,
    GET_CAR: Query<RequestTypes<void, { ":id": ID }, void>, ResponseTypes<Car>>
}

export const API_SCHEMA: API_SCHEMA_TYPE = {
    GET_ALL_CARS: {
        method: RequestMethod.Get,
        url: `${API_BASE}/garage`,
    },
    GET_CAR: {
        method: RequestMethod.Get,
        url: `${API_BASE}/garage/:id`,
    },
};
