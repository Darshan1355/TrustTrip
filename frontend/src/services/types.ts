/**
 * Location-related type definitions
 */

/** Raw coordinates from device GPS */
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

/** Location permission state */
export type LocationPermissionState =
  | 'not-requested'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'denied-forever';

/** Location tracking status */
export type LocationTrackingStatus =
  | 'idle'
  | 'requesting-permission'
  | 'permission-denied'
  | 'acquiring-location'
  | 'tracking'
  | 'error'
  | 'gps-disabled';

/** Backend response when location is sent */
export interface LocationUpdateResponse {
  success: boolean;
  message: string;
  insideGeofence?: boolean;
  locationId?: number;
  locationName?: string;
}

/** Configuration for location tracking */
export interface LocationTrackingConfig {
  updateIntervalMs: number; // milliseconds between location updates (e.g., 60000 = 60 seconds)
  foregroundTracking: boolean; // enable foreground tracking
  backgroundTracking: boolean; // enable background tracking (requires additional permissions)
}

/** Location tracking state */
export interface LocationTrackingState {
  status: LocationTrackingStatus;
  currentLocation: LocationCoordinates | null;
  permissionState: LocationPermissionState;
  lastUpdateTime: number | null;
  error: string | null;
  isTracking: boolean;
}

/** Authenticated user (from AsyncStorage) */
export interface AuthenticatedUser {
  id: number | string;
  username: string;
}
