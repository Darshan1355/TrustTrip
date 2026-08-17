/**
 * LocationPermissionCard Component
 * Displays location permission request and status
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import type { LocationPermissionState, LocationTrackingStatus } from '../services/types';

interface LocationPermissionCardProps {
  /**
   * Current permission state
   */
  permissionState: LocationPermissionState;

  /**
   * Current tracking status
   */
  status: LocationTrackingStatus;

  /**
   * Callback when permission is granted
   */
  onPermissionGranted?: () => void;

  /**
   * Callback when permission is denied
   */
  onPermissionDenied?: () => void;

  /**
   * Callback to request permission
   */
  onRequestPermission: () => void;

  /**
   * Show card (default: true)
   */
  visible?: boolean;

  /**
   * Custom error message
   */
  errorMessage?: string | null;
}

export const LocationPermissionCard: React.FC<LocationPermissionCardProps> = ({
  permissionState,
  status,
  onPermissionGranted,
  onPermissionDenied,
  onRequestPermission,
  visible = true,
  errorMessage,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  const isLoading = status === 'requesting-permission' || status === 'acquiring-location';
  const isGranted = permissionState === 'granted';
  const isDeniedForever = permissionState === 'denied-forever';
  const isDenied = permissionState === 'denied' || isDeniedForever;

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      Alert.alert('Error', 'Unable to open device settings');
    }
  };

  // Trigger callbacks on state change
  useEffect(() => {
    if (isGranted) {
      onPermissionGranted?.();
    } else if (isDenied) {
      onPermissionDenied?.();
    }
  }, [isGranted, isDenied, onPermissionGranted, onPermissionDenied]);

  if (!visible) {
    return null;
  }

  // Permission granted - show tracking status
  if (isGranted) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Location Permission Granted</Text>
          <Text style={styles.description}>
            TrustTrip can now access your location to track crowd density and determine if you're
            inside a monitored area.
          </Text>
          {status === 'tracking' && (
            <Text style={styles.trackingBadge}>📍 Location monitoring active</Text>
          )}
        </View>
      </View>
    );
  }

  // Permission denied permanently - show settings button
  if (isDeniedForever) {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>Location Permission Required</Text>
          <Text style={styles.description}>
            TrustTrip needs your location to determine whether you are inside a monitored tourist
            area and contribute to anonymous crowd statistics.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.settingsButton]}
            onPress={handleOpenSettings}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Open Device Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Permission not requested yet - show request button
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.title}>Location Permission Required</Text>
        <Text style={styles.description}>
          TrustTrip needs your location to determine whether you are inside a monitored tourist
          area and contribute to anonymous crowd statistics.
        </Text>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={onRequestPermission}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Allow Location Access</Text>
          )}
        </TouchableOpacity>

        {errorMessage && (
          <Text style={styles.errorText}>
            <Text style={styles.errorIcon}>❌ </Text>
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardContent: {
    alignItems: 'center',
  },

  // Icon styles
  locationIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  warningIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  successIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  errorIcon: {
    fontSize: 14,
  },

  // Title styles
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },

  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 8,
    textAlign: 'center',
  },

  successTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginBottom: 8,
    textAlign: 'center',
  },

  // Description
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },

  // Button styles
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 8,
  },

  primaryButton: {
    backgroundColor: '#4F46E5',
  },

  settingsButton: {
    backgroundColor: '#F59E0B',
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Tracking badge
  trackingBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    overflow: 'hidden',
  },

  // Error text
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default LocationPermissionCard;
