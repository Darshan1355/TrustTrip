/**
 * Location Service
 * Handles GPS location tracking and communication with backend
 */

import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import type {
  LocationCoordinates,
  LocationPermissionState,
  LocationUpdateResponse,
  LocationTrackingConfig,
  AuthenticatedUser,
} from './types';

// Default configuration
const DEFAULT_CONFIG: LocationTrackingConfig = {
  updateIntervalMs: 60000, // 60 seconds between updates
  foregroundTracking: true,
  backgroundTracking: false, // disabled by default to preserve battery
};

/**
 * Get current permission state
 */
export const getLocationPermissionState = async (): Promise<LocationPermissionState> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();

    if (status === 'granted') {
      return 'granted';
    } else if (status === 'denied') {
      return 'denied';
    } else if (status === 'undetermined') {
      return 'not-requested';
    }

    return 'denied-forever';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'denied';
  }
};

/**
 * Request foreground location permission
 */
export const requestLocationPermission = async (): Promise<LocationPermissionState> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      return 'granted';
    } else if (status === 'denied') {
      return 'denied';
    }

    return 'denied-forever';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return 'denied';
  }
};

/**
 * Get current GPS coordinates
 * Requires permission to be already granted
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 0,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      altitude: location.coords.altitude,
      altitudeAccuracy: location.coords.altitudeAccuracy ?? null,
      heading: location.coords.heading,
      speed: location.coords.speed,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    return null;
  }
};

/**
 * Watch location changes (for continuous tracking)
 * Requires permission to be already granted
 */
export const watchLocation = (
  onLocationChange: (coords: LocationCoordinates) => void,
  onError: (error: Error) => void,
  config: Partial<LocationTrackingConfig> = {}
): (() => void) => {
  const settings = { ...DEFAULT_CONFIG, ...config };
  let unsubscribeFn: (() => void) | null = null;

  Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: settings.updateIntervalMs,
      distanceInterval: 0,
    },
    (location) => {
      const coords: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        altitude: location.coords.altitude,
        altitudeAccuracy: location.coords.altitudeAccuracy ?? null,
        heading: location.coords.heading,
        speed: location.coords.speed,
      };
      onLocationChange(coords);
    }
  )
    .then((subscription) => {
      unsubscribeFn = () => subscription.remove();
    })
    .catch((error) => {
      console.error('Error watching location:', error);
      onError(error instanceof Error ? error : new Error(String(error)));
    });

  // Return unsubscribe function
  return () => {
    if (unsubscribeFn) {
      unsubscribeFn();
    }
  };
};

/**
 * Send location to backend
 * The authenticated user ID comes from the user object stored in AsyncStorage
 */
export const sendLocationToBackend = async (
  coordinates: LocationCoordinates
): Promise<LocationUpdateResponse> => {
  try {
    // Get authenticated user from AsyncStorage
    const userStr = await AsyncStorage.getItem('user');
    if (!userStr) {
      return {
        success: false,
        message: 'User not authenticated',
      };
    }

    const user: AuthenticatedUser = JSON.parse(userStr);
    if (!user.id) {
      return {
        success: false,
        message: 'Invalid user ID',
      };
    }

    // Send location to backend
    const response = await api.post<LocationUpdateResponse>('/crowd/location-update', {
      user_id: user.id,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      accuracy: coordinates.accuracy,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending location to backend:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      message: `Failed to send location: ${errorMessage}`,
    };
  }
};

/**
 * Complete location tracking flow:
 * 1. Check/request permission
 * 2. Get current location
 * 3. Send to backend
 */
export const trackAndSendLocation = async (
  config: Partial<LocationTrackingConfig> = {}
): Promise<{
  success: boolean;
  location: LocationCoordinates | null;
  backendResponse: LocationUpdateResponse | null;
  error: string | null;
}> => {
  try {
    // Check permission
    const permissionState = await getLocationPermissionState();

    if (permissionState !== 'granted') {
      return {
        success: false,
        location: null,
        backendResponse: null,
        error: 'Location permission not granted',
      };
    }

    // Get current location
    const location = await getCurrentLocation();

    if (!location) {
      return {
        success: false,
        location: null,
        backendResponse: null,
        error: 'Unable to get current location',
      };
    }

    // Send to backend
    const backendResponse = await sendLocationToBackend(location);

    return {
      success: backendResponse.success,
      location,
      backendResponse,
      error: backendResponse.success ? null : backendResponse.message,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return {
      success: false,
      location: null,
      backendResponse: null,
      error: errorMessage,
    };
  }
};

export default {
  getLocationPermissionState,
  requestLocationPermission,
  getCurrentLocation,
  watchLocation,
  sendLocationToBackend,
  trackAndSendLocation,
};
