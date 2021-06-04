import { Query, RequestTypes, ResponseTypes } from "../api/api";

import { buildQuery } from "./buildQuery";
import { HttpRequestError } from "./HttpRequestError";

export async function sendRequest<RequestBody, PathParams, QueryParams, ResponseBody, ResponseHeaders>({
  resource: { method, url },
  queryParams,
  pathParams,
  body,
  doRequest = fetch,
}: {
  resource: Query<RequestTypes<RequestBody, PathParams, QueryParams>, RequestTypes<ResponseBody, ResponseHeaders>>;
  queryParams?: QueryParams;
  pathParams?: PathParams;
  body?: RequestBody;
  doRequest?: typeof fetch;
}): Promise<ResponseTypes<ResponseBody, ResponseHeaders>> {
  const response = await doRequest(buildQuery({ url, queryParams, pathParams }), {
    method,
    ...(body ? {
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined
    } : {})
  });

  if (!response.ok) {
    throw new HttpRequestError("Response error", response.status, await response.text());
  }

  try {
    return {
      body: await response.json(),
      headers: response.headers,
      status: response.status,
    };
  } catch (e) {
    throw new HttpRequestError("Failed to parse response body", response.status);
  }
};
