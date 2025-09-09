import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = ((Constants as any).expoConfig?.extra)?.API_URL as string | undefined;

export const api = axios.create({
  baseURL: API_URL ?? 'http://10.0.2.2:5000/api',
  timeout: 20000,
  withCredentials: true,
});

// Example request interceptor (attach auth token if present)
api.interceptors.request.use(async (config) => {
  // Lazy import to avoid circular deps at module load time
  const { useAuthStore } = await import('@/store/useAuthStore');
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Example response interceptor (handle common errors)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    // You can centralize error handling here
    return Promise.reject(error);
  }
);

export default api;
