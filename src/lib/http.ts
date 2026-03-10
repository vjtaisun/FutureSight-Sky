export class ApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function parseJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? ((await response.json()) as T | { detail?: string }) : await response.text();

  if (!response.ok) {
    if (typeof payload === 'string' && payload.trim()) {
      throw new ApiError(payload.trim(), response.status);
    }

    const message =
      typeof payload === 'object' && payload && 'detail' in payload && payload.detail
        ? payload.detail
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  if (!isJson) {
    throw new ApiError('Unexpected response format from server.', response.status);
  }

  return payload as T;
}
