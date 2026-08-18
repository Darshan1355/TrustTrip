import axios from "axios";
import { Platform } from "react-native";
import { API_BASE_URL, REQUEST_TIMEOUT } from "./constants";
import AxiosErrorLogger from "../utils/axiosErrorLogger";

// initialize logger (loads persisted logs)
AxiosErrorLogger.initAxiosErrorLogger().catch(() => {});

// Resolve a development-friendly base URL for the current platform.
let resolvedBase = API_BASE_URL;
try {
  if (!API_BASE_URL || API_BASE_URL.includes("your-backend-domain.com")) {
    resolvedBase = Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";
  } else if (API_BASE_URL.includes("localhost") && Platform.OS === "android") {
    resolvedBase = API_BASE_URL.replace("localhost", "10.0.2.2");
  }
} catch (e) {
  resolvedBase = API_BASE_URL;
}

const api = axios.create({
  baseURL: resolvedBase,
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    try {
      if (error.response) {
        console.log("[v0] API request failed:", error.response.status);
        AxiosErrorLogger.logError({
          type: 'response',
          status: error.response.status,
          data: error.response.data,
          config: {
            method: error.config?.method,
            url: error.config?.url,
            params: error.config?.params,
            data: error.config?.data,
          },
        });
      } else if (error.request) {
        console.log("NETWORK ERROR:", error.message);
        AxiosErrorLogger.logError({ type: 'network', message: error.message, config: error.config });
      } else {
        console.log("REQUEST ERROR:", error.message);
        AxiosErrorLogger.logError({ type: 'request', message: error.message });
      }
    } catch (e) {
      // ignore logging failures
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
