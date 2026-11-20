import axios from "axios";

// The ONE axios instance for the whole app (Customer Website + Admin Panel).
// Same base URL the app has always used.
export const BASE_URL = String(import.meta.env.VITE_API_URL || "http://localhost:3001/api")
  .trim()
  .replace(/\/+$/, "");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// The store is not imported here (store -> slices -> api -> axiosConfig would be a cycle).
// store.js calls configureAxios() once, handing over token getters and 401 handlers.
let handlers = {
  getCustomerToken: () => null,
  getAdminToken: () => null,
  onCustomerUnauthorized: () => {},
  onAdminUnauthorized: () => {},
};

export const configureAxios = (next) => {
  handlers = { ...handlers, ...next };
};

// Every admin endpoint lives under /admin; everything else is the customer API.
const isAdminRequest = (url = "") => /^\/?admin(\/|$)/.test(url);

// A 401 from login/register means "wrong credentials", not "session expired".
const isCredentialRequest = (url = "") => /\/auth\/(login|register)$/.test(url);

axiosInstance.interceptors.request.use((config) => {
  const token = isAdminRequest(config.url)
    ? handlers.getAdminToken()
    : handlers.getCustomerToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || "";
    if (error.response?.status === 401 && !isCredentialRequest(url)) {
      if (isAdminRequest(url)) handlers.onAdminUnauthorized();
      else handlers.onCustomerUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
