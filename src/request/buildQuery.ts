const buildQueryParams = (params: unknown) => {
  const paramString = Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join("&");

  return `?${paramString}`;
};

const setPathParams = (url: string, params: unknown) => Object
  .keys(params)
  .reduce((result, key) => result.replace(key, String(params[key])), url)

export function buildQuery({ url, queryParams, pathParams }: { url: string, queryParams?: unknown | void, pathParams?: unknown | void }) {
  return `${pathParams ? setPathParams(url, pathParams) : url}${queryParams ? buildQueryParams(queryParams) : ''}`;
}
