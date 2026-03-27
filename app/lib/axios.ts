import axios from "axios";
import { API_BASE_URL, AUTH_TOKEN_KEY, PLATFORM_ID, PLATFORM_HEADER } from "./constants";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  config.headers[PLATFORM_HEADER] = PLATFORM_ID;
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export function createServerClient(cookieHeader: string) {
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_TOKEN_KEY}=`))
    ?.split("=")[1];

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      [PLATFORM_HEADER]: PLATFORM_ID,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export default apiClient;
