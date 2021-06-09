import { ID, Winner, WinnersSortColumns, SortOrder, Car, CarEngineStatus, CarStatus, Identifiable } from "./types";

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

export type Params = Record<string, string | number | boolean>;

export interface WithPayload<T = void> {
    body: T;
}

export interface WithQueryParams<T = void> {
    queryParams: T;
}

export interface WithPathParams<T = void> {
    pathParams: T;
}

export type RequestArguments<Payload = void, PathParams = void, QueryParams = void> =
    | WithPayload<Payload>
    | WithPathParams<PathParams>
    | WithQueryParams<QueryParams>

export interface Query<ResResult, ReqArgs = RequestArguments> extends RequestResource { }

export const TOTAL_COUNT_HEADER = "X-Total-Count"

export const ID_PATH_PARAM = ":id";

type IdPathParam = { [ID_PATH_PARAM]: ID };

export type EntityBody<T extends Identifiable> = Omit<T, "id">;

type CrudQueries<T extends Identifiable> = {
    GET_BY_ID: Query<T, RequestArguments<void, IdPathParam, void>>;
    CREATE: Query<T, RequestArguments<EntityBody<T>, void, void>>;
    DELETE: Query<void, RequestArguments<void, IdPathParam, void>>;
    UPDATE: Query<T, RequestArguments<EntityBody<T>, IdPathParam, void>>;
}

type CarQueries = CrudQueries<Car>;
type WinnerQueries = CrudQueries<Winner>;

export type API_SCHEMA_TYPE = {
    GET_ALL_CARS: Query<Car[], RequestArguments<void, void, { _page: number; _limit: number }>>;
    GET_CAR: CarQueries["GET_BY_ID"];
    CREATE_CAR: CarQueries["CREATE"];
    DELETE_CAR: CarQueries["DELETE"];
    UPDATE_CAR: CarQueries["UPDATE"];
    SET_CAR_ENGINE_STATUS: Query<CarStatus, RequestArguments<void, void, IdPathParam & { status: CarEngineStatus.Started | CarEngineStatus.Stopped }>>;
    START_CAR_MOVING: Query<{ success: true }, RequestArguments<void, void, IdPathParam & { status: CarEngineStatus.Drive }>>;
    GET_ALL_WINNERS: Query<Winner[], RequestArguments<void, void, { _page: number; _limit: number; _sort?: WinnersSortColumns; _order?: SortOrder }>>;
    GET_WINNER: WinnerQueries["GET_BY_ID"];
    CREATE_WINNER: WinnerQueries["CREATE"];
    DELETE_WINNER: WinnerQueries["DELETE"];
    UPDATE_WINNER: WinnerQueries["UPDATE"];
}

const GARAGE_BASE = '/garage';
const GARAGE_ID = `${GARAGE_BASE}/${ID_PATH_PARAM}`;

const ENGINE_BASE = '/engine';

const WINNER_BASE = '/winners';
const WINNER_ID = `${WINNER_BASE}/${ID_PATH_PARAM}`;

export const API_SCHEMA: API_SCHEMA_TYPE = {
    GET_ALL_CARS: {
        method: RequestMethod.Get,
        url: GARAGE_BASE,
    },
    GET_CAR: {
        method: RequestMethod.Get,
        url: GARAGE_ID,
    },
    CREATE_CAR: {
        method: RequestMethod.Post,
        url: GARAGE_BASE,
    },
    DELETE_CAR: {
        method: RequestMethod.Delete,
        url: GARAGE_ID,
    },
    UPDATE_CAR: {
        method: RequestMethod.Put,
        url: GARAGE_ID,
    },
    SET_CAR_ENGINE_STATUS: {
        method: RequestMethod.Get,
        url: ENGINE_BASE,
    },
    START_CAR_MOVING: {
        method: RequestMethod.Get,
        url: ENGINE_BASE,
    },
    GET_ALL_WINNERS: {
        method: RequestMethod.Get,
        url: WINNER_BASE,
    },
    GET_WINNER: {
        method: RequestMethod.Get,
        url: WINNER_ID,
    },
    CREATE_WINNER: {
        method: RequestMethod.Post,
        url: WINNER_BASE,
    },
    DELETE_WINNER: {
        method: RequestMethod.Delete,
        url: WINNER_ID,
    },
    UPDATE_WINNER: {
        method: RequestMethod.Put,
        url: WINNER_ID,
    }
};
