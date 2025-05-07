import { getToken } from "@/helpers/localStorage";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: string | null;
}

export interface IPaginationResponse<T> {
  result: T[];
  meta: IMeta | null;
}

export interface IMeta {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => Promise.reject(error)
);

export default api;
