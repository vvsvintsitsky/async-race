import { Query, WithQueryParams, WithPathParams, Params, WithPayload } from "../api/api";
import { extractProperty } from "../utils/extractProperty";

import { buildQuery } from "./buildQuery";
import { HttpRequestError } from "./HttpRequestError";

export async function sendRequest<T, Y>({
  resource: { method, url },
  variables,
  doRequest = fetch,
  host = "",
}: {
  resource: Query<T, Y>;
  variables?: Y;
  doRequest?: typeof fetch;
  host?: string;
}): Promise<{ status: number, headers: Headers, body: T }> {
  const body = extractProperty<WithPayload>(variables, "body");
  const pathParams = extractProperty<WithPathParams<Params>>(variables, "pathParams");
  const queryParams = extractProperty<WithQueryParams<Params>>(variables, "queryParams");

  const response = await doRequest(`${host}${buildQuery({ url, queryParams, pathParams })}`, {
    method,
    ...(body ? {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    } : {})
  });

  if (!response.ok) {
    throw new HttpRequestError("Response error", response.status, await response.text());
  }

  try {
    return {
      body: await response.json(),
      status: response.status,
      headers: response.headers,
    };
  } catch (e) {
    throw new HttpRequestError("Failed to parse response body", response.status);
  }
};
