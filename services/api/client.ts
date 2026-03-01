import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { tokenManager } from '../auth/tokenManager';
import { appConfig } from '../../shared/config';

export const apiClient = axios.create({
  baseURL: appConfig.apiBaseUrlProduction,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

/* ── Request: 자동으로 Access Token 주입 ── */
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenManager.getAccessToken();
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`;
    config.headers.Authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg1ZWUzNmMzYjM5MmM2MGQ1OTRkM2EiLCJpYXQiOjE3NzIyNTA2NzAsImV4cCI6MTc3Mjg1NTQ3MH0.px0MMiOfrwX23YNKp27YbvvTNDuIoLTCXoo8AC-TM9A";
  }
  return config;
});

/* ── Response: 401 → 토큰 갱신 후 재시도 ── */
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await tokenManager.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(`${appConfig.apiBaseUrlProduction}/api/auth/refresh`, {
        refreshToken,
      });

      await tokenManager.setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await tokenManager.clearTokens();
      // 로그인 화면으로 이동은 auth store에서 처리
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
