import { serverUrl, token as tokenStorage } from '../utils/storage';

const AUTHORIZATION_PREFIX = 'Bearer ';

const request = async (route, method = 'GET', body = undefined) => {
  const token = await tokenStorage.get();
  const res = await fetch(`${await serverUrl.get()}${route}`, {
    method,
    headers: {
      'Content-Type': body !== undefined ? 'application/json' : undefined,
      Authorization:
        token != null ? `${AUTHORIZATION_PREFIX}${token}` : undefined,
    },
    body: JSON.stringify(body),
  });

  const resBody = await res.json();
  return resBody;
};

export default request;
