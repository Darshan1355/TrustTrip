import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'AXIOS_ERROR_LOGS_V1';
let logs = [];
let subscribers = new Set();

async function load() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) logs = JSON.parse(raw);
  } catch (e) {
    // ignore
  }
}

async function save() {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(-200)));
  } catch (e) {
    // ignore
  }
}

function notify() {
  subscribers.forEach((cb) => {
    try {
      cb(logs);
    } catch (e) {
      // ignore subscriber errors
    }
  });
}

export async function initAxiosErrorLogger() {
  await load();
}

export function logError(entry) {
  const record = {
    ts: new Date().toISOString(),
    ...entry,
  };
  logs.push(record);
  // cap stored logs
  if (logs.length > 500) logs = logs.slice(-500);
  save();
  notify();
}

export function getErrors() {
  return logs.slice().reverse();
}

export function clearErrors() {
  logs = [];
  save();
  notify();
}

export function subscribe(cb) {
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

export default {
  initAxiosErrorLogger,
  logError,
  getErrors,
  clearErrors,
  subscribe,
};
