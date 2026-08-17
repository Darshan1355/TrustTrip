/**
 * usePushNotifications Hook
 * Custom React hook for managing push notifications in TrustTrip
 * Handles token registration, permission requests, and notification listeners
 */

import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  getExpoPushToken,
  requestNotificationPermission,
  registerPushTokenWithBackend,
  getStoredPushToken,
  listenToForegroundNotifications,
  listenToNotificationTaps,
  getLastNotificationResponse,
} from "../services/pushNotificationService";

export type NotificationPermissionStatus = "undetermined" | "granted" | "denied";

export interface UsePushNotificationsReturn {
  // State
  permissionStatus: NotificationPermissionStatus;
  isInitialized: boolean;
  pushToken: string | null;
  lastNotification: Notifications.Notification | null;

  // Methods
  requestPermission: () => Promise<boolean>;
  registerToken: (userId: number) => Promise<boolean>;
  initializeNotifications: () => Promise<void>;
}

/**
 * Hook to manage push notifications
 * @param onNotificationReceived - Optional callback when notification received while app in foreground
 * @param onNotificationTapped - Optional callback when notification is tapped
 */
export const usePushNotifications = (
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void
): UsePushNotificationsReturn => {
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>("undetermined");
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);

  const unsubscribeForeground = useRef<(() => void) | null>(null);
  const unsubscribeNotificationResponse = useRef<(() => void) | null>(null);

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      const granted = await requestNotificationPermission();
      setPermissionStatus(granted ? "granted" : "denied");
      return granted;
    } catch (error) {
      console.error("Error requesting permission:", error);
      setPermissionStatus("denied");
      return false;
    }
  };

  // Register push token with backend
  const registerToken = async (userId: number): Promise<boolean> => {
    try {
      const token = await getExpoPushToken();
      if (!token) {
        console.log("Could not obtain push token");
        return false;
      }

      setPushToken(token);

      const result = await registerPushTokenWithBackend(userId, token);
      return result.success;
    } catch (error) {
      console.error("Error registering token:", error);
      return false;
    }
  };

  // Initialize push notifications (request permission, get token, register)
  const initializeNotifications = async (): Promise<void> => {
    try {
      // Check permission status
      const permissions = await Notifications.getPermissionsAsync();
      const permObj = permissions as any;
      const status = permObj.status || permObj.ios?.status || "undetermined";
      
      setPermissionStatus(
        status === "granted" ? "granted" : status === "denied" ? "denied" : "undetermined"
      );

      // Request permission if not already granted
      if (status !== "granted") {
        const granted = await requestPermission();
        if (!granted) {
          setIsInitialized(false);
          return;
        }
      }

      // Get push token
      const token = await getExpoPushToken();
      if (token) {
        setPushToken(token);
      }

      // Check if stored token is different (might indicate new device/reinstall)
      const storedData = await getStoredPushToken();
      if (storedData && storedData.token !== token) {
        console.log("Push token changed, will need to re-register");
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing notifications:", error);
      setIsInitialized(false);
    }
  };

  // Set up notification listeners
  useEffect(() => {
    // Listen to incoming notifications while app is in foreground
    if (onNotificationReceived) {
      unsubscribeForeground.current = listenToForegroundNotifications(
        (notification) => {
          setLastNotification(notification);
          onNotificationReceived(notification);
        }
      );
    }

    // Listen to notification taps (foreground, background, or from terminated)
    if (onNotificationTapped) {
      unsubscribeNotificationResponse.current = listenToNotificationTaps(
        onNotificationTapped
      );
    }

    // Handle notification response when app was closed/backgrounded
    getLastNotificationResponse().then((response) => {
      if (response && onNotificationTapped) {
        console.log("App opened from notification:", response);
        onNotificationTapped(response);
      }
    });

    // Cleanup
    return () => {
      if (unsubscribeForeground.current) {
        unsubscribeForeground.current();
      }
      if (unsubscribeNotificationResponse.current) {
        unsubscribeNotificationResponse.current();
      }
    };
  }, [onNotificationReceived, onNotificationTapped]);

  return {
    permissionStatus,
    isInitialized,
    pushToken,
    lastNotification,
    requestPermission,
    registerToken,
    initializeNotifications,
  };
};
