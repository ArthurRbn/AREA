import {clearToken, getToken} from "./auth";

async function myFetch<T>(
  request: RequestInfo,
  method: string,
  body: string = ""
): Promise<T> {
  const token = getToken();
  const url = "http://localhost:8080" + request;
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", token != null ? `Bearer ${token}` : "");

  const response = await fetch(url, {
    method: method,
    headers: requestHeaders,
    body: body.length ? body : undefined,
  });

  if (response.status === 401) {
    clearToken();
    window.location.replace('/auth');
  }
  return response.json().catch(() => ({}));
}

export default myFetch;
