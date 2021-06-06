import { Query, WithData, RequestArguments, PAYLOAD_KEY,PATH_PARAMS_KEY, QUERY_PARAMS_KEY } from "../api/api";

import { buildQuery } from "./buildQuery";
import { HttpRequestError } from "./HttpRequestError";

function extractProperty<T>(baseObject: T, key: string): unknown {
  return key in baseObject ? baseObject[key] : undefined;
}

export async function sendRequest<ReqPayload, ReqPathParams, ReqQueryParams, ResData>({
  resource: { method, url },
  variables,
  doRequest = fetch,
}: {
  resource: Query<ResData, RequestArguments<ReqPayload, ReqPathParams, ReqQueryParams>>;
  variables: RequestArguments<ReqPayload, ReqPathParams, ReqQueryParams>;
  doRequest?: typeof fetch;
}): Promise<WithData<ResData> & { status: number, headers: Headers }> {
  const body = extractProperty(variables, PAYLOAD_KEY);
  const pathParams = extractProperty(variables, PATH_PARAMS_KEY);
  const queryParams = extractProperty(variables, QUERY_PARAMS_KEY);

  const response = await doRequest(buildQuery({ url, queryParams, pathParams }), {
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
