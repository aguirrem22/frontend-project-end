const envApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackApiBase = import.meta.env.PROD
  ? '/api'
  : 'http://localhost:3000/api';

function normalizeApiBase(value) {
  const base = (value || '').trim().replace(/\/$/, '');
  if (!base) return '';
  if (base === '/api' || base.endsWith('/api')) return base;
  if (base.startsWith('http://') || base.startsWith('https://')) return `${base}/api`;
  return base;
}

const API_BASE = normalizeApiBase(envApiBase) || fallbackApiBase;

export function apiUrl(path = '') {
  if (!path) return API_BASE;
  return `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
