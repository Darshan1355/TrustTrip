# TrustTrip Location Tracking Implementation Guide

## Overview
This document describes the implementation of Android location permission and GPS tracking for the TrustTrip React Native (Expo) application.

## Architecture

### 1. **Location Service** (`src/services/locationService.ts`)
Centralized service for all location-related operations:
- `getLocationPermissionState()` - Check current permission state
- `requestLocationPermission()` - Request foreground location permission
- `getCurrentLocation()` - Get current GPS coordinates (one-time)
- `watchLocation()` - Continuous location tracking
- `sendLocationToBackend()` - Send coordinates to Flask API
- `trackAndSendLocation()` - Complete end-to-end flow

### 2. **Location Tracking Hook** (`src/hooks/useLocationTracking.ts`)
React hook that manages location state and subscriptions:
- Automatic subscription cleanup on unmount
- Permission request handling
- Location update callbacks
- Auto-send functionality with configurable intervals
- Error state management

### 3. **Location Permission Card** (`src/components/LocationPermissionCard.tsx`)
UI component for requesting and displaying location permission status:
- Shows permission request prompt
- Displays granted status
- Shows settings button if permanently denied
- Displays current tracking status
- Handles error messages

### 4. **Integration Points**

#### CrowdScreen (`src/screens/Crowd/CrowdScreen.tsx`)
- Shows `LocationPermissionCard` when user enters screen
- Enables location tracking when permission is granted
- Displays current tracking status in status card
- Configurable update interval (default: 60 seconds)
- Auto-refreshes crowd data when location is sent

#### MapViewScreen (`src/screens/Crowd/MapViewScreen.tsx`)
- Manual location send button (📍 icon)
- Auto-send toggle
- Configurable update intervals (30s, 60s, 2m, 5m)
- Refreshes map pins when location is updated

## Configuration

### Expo Configuration (`app.json`)
Already configured with:
```json
{
  "android": {
    "permissions": [
      "android.permission.ACCESS_COARSE_LOCATION",
      "android.permission.ACCESS_FINE_LOCATION"
    ]
  },
  "plugins": [
    [
      "expo-location",
      {
        "locationAlwaysAndWhenInUsePermission": "Allow TrustTrip to access your location."
      }
    ]
  ]
}
```

### Location Update Interval
Default: 60 seconds (60000 ms)
Configurable via:
- CrowdScreen: `locationUpdateInterval` state
- MapViewScreen: `intervalSeconds` state

### Backend API Endpoint
```
POST /crowd/location-update
Body: {
  "user_id": <authenticated_user_id>,
  "latitude": <number>,
  "longitude": <number>,
  "accuracy": <number|null>
}
```

The backend:
1. Determines if user is inside any geofence
2. Records location in `user_locations` table
3. Updates crowd snapshots
4. Returns success/failure response

## Permission Flow

```
User opens Crowd Monitoring Screen
    ↓
LocationPermissionCard shows request
    ↓
User taps "Allow Location Access"
    ↓
System shows Android permission dialog
    ↓
User grants permission
    ↓
Location tracking starts automatically
    ↓
Location sent to backend at configured interval
    ↓
Crowd data updated on screen
```

## Error Handling

| State | Message | Recovery |
|-------|---------|----------|
| Permission not requested | "Location permission required" | Request permission |
| Permission denied | "Location permission denied" | Request again |
| Permission denied (forever) | "Location permission permanently denied" | Open device settings |
| GPS disabled | "Unable to determine current location" | Enable device GPS |
| Backend unavailable | "Failed to send location" | Retry automatically |
| Network error | Display error message | Automatic retry at next interval |

## TypeScript Types

All types are defined in `src/services/types.ts`:

```typescript
interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

type LocationPermissionState =
  | 'not-requested'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'denied-forever';

type LocationTrackingStatus =
  | 'idle'
  | 'requesting-permission'
  | 'permission-denied'
  | 'acquiring-location'
  | 'tracking'
  | 'error'
  | 'gps-disabled';

interface LocationTrackingState {
  status: LocationTrackingStatus;
  currentLocation: LocationCoordinates | null;
  permissionState: LocationPermissionState;
  lastUpdateTime: number | null;
  error: string | null;
  isTracking: boolean;
}
```

## Authentication Integration

- User ID obtained from AsyncStorage (set during login)
- User object stored as: `{ id: <number>, username: <string> }`
- Location requests include authenticated user ID
- Backend identifies user from request, not from client data
- No trust of client-supplied user ID

## Testing Checklist

### 1. Permission Flow
- [ ] App installed and runs without errors
- [ ] Open Crowd Monitoring screen
- [ ] LocationPermissionCard is visible
- [ ] Tap "Allow Location Access"
- [ ] Android permission dialog appears
- [ ] Tap "Allow" in system dialog
- [ ] Permission card shows success
- [ ] Status card shows "Location: Tracking Active"

### 2. Location Acquisition
- [ ] Manual location tap (📍) on MapViewScreen works
- [ ] Coordinates are logged to console
- [ ] Error messages display if GPS is disabled

### 3. Backend Communication
- [ ] Check Flask server logs for POST to `/crowd/location-update`
- [ ] User ID is correctly passed
- [ ] Coordinates are received
- [ ] Database shows entry in `user_locations` table

### 4. Geofencing
- [ ] Test with coordinates inside a monitored geofence
- [ ] Backend calculates geofence correctly
- [ ] Crowd count updates
- [ ] CrowdScreen refreshes with new data

### 5. Auto-Send Functionality
- [ ] CrowdScreen: Enable location tracking
- [ ] Observe location updates at configured interval
- [ ] Check backend logs for periodic requests
- [ ] Stop tracking when navigating away

### 6. MapViewScreen Auto-Send
- [ ] Toggle "Auto-Send: ON"
- [ ] Select update interval
- [ ] Observe periodic location sends
- [ ] Map refreshes with updated crowd data
- [ ] Toggle "Auto-Send: OFF" to stop

### 7. Permission Denial
- [ ] Clear app data
- [ ] Open Crowd Monitoring
- [ ] Tap "Allow Location Access"
- [ ] Tap "Deny" in system dialog
- [ ] Card shows "Location permission denied"
- [ ] Tap button again to retry
- [ ] Tap "Allow" to grant permission

### 8. Permission Permanently Denied
- [ ] Deny permission once
- [ ] Try to request again
- [ ] On second denial, check "Don't ask again" (if shown)
- [ ] Card displays "Open Device Settings" button
- [ ] Tap button to open Android settings
- [ ] Grant permission in settings
- [ ] Return to app and verify tracking works

### 9. Logout/Login
- [ ] Complete location flow as user A
- [ ] Log out (Profile screen)
- [ ] Log in as user B
- [ ] Open Crowd Monitoring
- [ ] Request permission again
- [ ] Verify location from user B is sent (different ID)

### 10. Screen Navigation
- [ ] Open Crowd Monitoring, start tracking
- [ ] Navigate to another screen
- [ ] Return to Crowd Monitoring
- [ ] Verify no duplicate subscriptions
- [ ] Verify tracking resumes correctly

### 11. GPS Disabled State
- [ ] On device, disable Location Services
- [ ] Open Crowd Monitoring
- [ ] Tap "Allow Location Access" (may still have permission)
- [ ] Try to send location manually
- [ ] Verify error: "Unable to determine your current location"
- [ ] Enable Location Services on device
- [ ] Try again - should work

### 12. Battery/Background
- [ ] Verify foreground tracking works
- [ ] Send app to background
- [ ] Check that background tracking is NOT active (by default)
- [ ] Return to foreground
- [ ] Verify tracking resumes

### 13. Multiple Screens
- [ ] Open MapViewScreen
- [ ] Enable Auto-Send
- [ ] Switch to other screens
- [ ] Return to MapViewScreen
- [ ] Verify Auto-Send state is preserved
- [ ] Check backend logs for continuous updates

### 14. Error Recovery
- [ ] Kill Flask backend
- [ ] Try to send location from MapViewScreen
- [ ] Observe error message
- [ ] Restart Flask backend
- [ ] Try again - should succeed

### 15. Build & TypeScript
- [ ] Run `npx tsc --noEmit` - should have no errors
- [ ] Run `npm run android` or build the app
- [ ] Verify compilation succeeds
- [ ] Install and test on device

## Files Created/Modified

### Created Files
- `src/services/types.ts` - TypeScript type definitions
- `src/services/locationService.ts` - Location service
- `src/hooks/useLocationTracking.ts` - Custom React hook
- `src/components/LocationPermissionCard.tsx` - Permission UI component

### Modified Files
- `src/screens/Crowd/CrowdScreen.tsx` - Added location tracking
- `src/screens/Crowd/MapViewScreen.tsx` - Refactored to use new service

### Configuration Files
- `app.json` - No changes (already configured)
- `package.json` - No changes (expo-location already installed)

## Troubleshooting

### Location permission always denied
- Ensure app has been granted permission on the device
- Check device settings: Settings → Apps → TrustTrip → Permissions → Location
- Uninstall and reinstall app if permissions are stuck

### getCurrentLocation() returns null
- Verify GPS is enabled on device
- Wait a few seconds for GPS to acquire fix (especially outdoors)
- Try location in open area away from buildings
- Check device GPS status bar

### Backend not receiving location
- Verify Flask server is running and accessible
- Check API_BASE_URL in `src/config/constants.js` matches your Flask server
- Check Flask server logs for requests
- Verify user is logged in (user ID stored in AsyncStorage)

### Duplicate location updates
- Verify hook cleanup on unmount is working
- Check browser DevTools console for warnings about subscriptions
- Clear subscriptions manually if app crashes

### TypeScript errors
- Run `npx tsc --noEmit` to identify issues
- Ensure all imports are correct
- Verify function signatures match type definitions
- Check that all required parameters are provided

## Performance Considerations

1. **Location Update Interval**: Default 60 seconds balances accuracy and battery life
2. **Geofence Radius**: Backend uses haversine distance calculation
3. **Crowd Aggregation**: 30-minute window (separate from location update interval)
4. **Subscription Cleanup**: Automatic on component unmount
5. **Auto-Send**: Only active on visible screens (useFocusEffect)

## Security Notes

1. **User Authentication**: Identified from AsyncStorage, not from client input
2. **Location Data**: Only sent to authenticated backend via HTTPS (when deployed)
3. **Permissions**: Uses native Android permission system
4. **No Background Tracking**: Default foreground-only to preserve privacy
5. **User Control**: Can disable tracking anytime via permission settings

## Future Enhancements

1. Background location tracking with opt-in
2. Geofence-based local notifications
3. Location history visualization
4. Battery optimization with adaptive intervals
5. Offline mode with local queue
6. Accessibility improvements for permission dialogs
