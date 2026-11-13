import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
// Ensure base URL always points to /api even if user sets root domain in env
if (rawUrl && !rawUrl.replace(/\/+$/, '').endsWith('/api')) {
  rawUrl = `${rawUrl.replace(/\/+$/, '')}/api`;
}

const api = axios.create({
  baseURL: rawUrl,
});

export default api;
