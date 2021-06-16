import { Params } from "../api/api";

const buildQueryParams = (params: Params) => {
  const paramString = Object.keys(params)
    .map((key) => {
      const value = params[key];
      return value !== undefined
        ? `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        : "";
    })
    .filter((value) => value)
    .join("&");

  return `?${paramString}`;
};

const setPathParams = (url: string, params: Params) =>
  Object.keys(params).reduce(
    (result, key) => result.replace(key, String(params[key])),
    url
  );

export function buildQuery({
  url,
  queryParams,
  pathParams,
}: {
  url: string;
  queryParams?: Params;
  pathParams?: Params;
}) {
  return `${pathParams ? setPathParams(url, pathParams) : url}${
    queryParams ? buildQueryParams(queryParams) : ""
  }`;
}
