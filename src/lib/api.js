const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function apiUrl(path = '') {
  return `${API_BASE}${path}`;
}
