export const post = async <TSuccess = any, TFailure = any>(
  path: string,
  body?: any,
) => {
  const response = await fetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (response.ok) {
    return json as TSuccess;
  } else {
    return Promise.reject(json as TFailure);
  }
};

export const get = async <TSuccess = any, TFailure = any>(
  path: string,
  query?: any,
  options: {
    headers?: Record<string, string>;
  } = {},
) => {
  // Convert query to string
  const queryString =
    query === undefined
      ? ''
      : typeof query === 'string'
      ? query
      : new URLSearchParams(query).toString();
  const response = await fetch(`${path}?${queryString}`.replace(/\?$/, ``), {
    headers: options.headers,
  });

  const json = await response.json();

  if (response.ok) {
    return json as TSuccess;
  } else {
    return Promise.reject(json as TFailure);
  }
};
