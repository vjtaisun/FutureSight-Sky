const defaultBaseUrl = 'http://localhost:8000';

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || defaultBaseUrl
};
