import { Platform } from "react-native";
import Constants from "expo-constants";

const expoExtra = Constants.expoConfig?.extra ?? {};
const runtimeProcessEnv = typeof process !== "undefined" ? process.env : {};

const getEnvValue = (key, fallback) => {
  const value = expoExtra[key] ?? runtimeProcessEnv[key] ?? fallback;
  return value ?? fallback;
};

const defaultApiBaseUrl = "http://10.215.185.190:5000";

export const API_BASE_URL = getEnvValue("API_BASE_URL", defaultApiBaseUrl);
export const APP_NAME = getEnvValue("APP_NAME", "TrustTrip");
export const APP_VERSION = getEnvValue("APP_VERSION", "1.0.0");
export const REQUEST_TIMEOUT = Number(getEnvValue("REQUEST_TIMEOUT", "10000"));
