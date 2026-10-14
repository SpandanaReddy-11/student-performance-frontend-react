// Backend address. Change it with VITE_API_URL in a .env file if needed.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const storage = {
  get token() {
    return localStorage.getItem('spa_token');
  },
  get user() {
    try {
      return JSON.parse(localStorage.getItem('spa_user'));
    } catch {
      return null;
    }
  },
  save(token, user) {
    localStorage.setItem('spa_token', token);
    localStorage.setItem('spa_user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('spa_token');
    localStorage.removeItem('spa_user');
  },
};

export async function api(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(storage.token ? { Authorization: 'Bearer ' + storage.token } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running on ' + API_URL);
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && storage.token) {
    storage.clear();
    window.location.href = '/login';
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const todayStr = () => new Date().toISOString().slice(0, 10);
export const fmtPct = (n) => (n === null || n === undefined ? '-' : n + '%');
