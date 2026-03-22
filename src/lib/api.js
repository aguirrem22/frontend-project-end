const envApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackApiBase = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:3000/api';

const API_BASE = (envApiBase || fallbackApiBase).replace(/\/$/, '');

export function apiUrl(path = '') {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
