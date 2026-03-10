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
  if (!contentType.includes('application/json')) {
    throw new ApiError('Unexpected response format from server.', response.status);
  }

  const payload = (await response.json()) as T | { detail?: string };

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'detail' in payload && payload.detail
        ? payload.detail
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return payload as T;
}
