// lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolve: (value?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get("accessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.client(originalRequest);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = Cookies.get("refreshToken");
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { accessToken, refreshToken: newRefreshToken } =
                response.data;

              Cookies.set("accessToken", accessToken, { expires: 1 });
              Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

              this.processQueue(null);
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.logout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private processQueue(error: any) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  private logout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    window.location.href = "/auth/login";
  }

  private async refreshToken(refreshToken: string) {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      refreshToken,
    });
  }

  // GET request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.get<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // POST request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T = any>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.post<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // PUT request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T = any>(
    url: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.put<T>(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // DELETE request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.client.delete<T>(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleError(error: any) {
    if (typeof window !== "undefined") {
      // Chỉ gọi toast ở phía client
      if (error.response) {
        const message = error.response.data?.message || "Có lỗi xảy ra";
        toast.error(message);
      } else if (error.request) {
        toast.error("Không thể kết nối tới server");
      } else {
        toast.error("Có lỗi xảy ra");
      }
    }
  }
}

export const apiClient = new ApiClient();
