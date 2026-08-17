import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../../config/api';
import useLocationTracking from '../../hooks/useLocationTracking';
import type { CrowdLocationApiResponse, CrowdMapPin } from './types';

const { width, height } = Dimensions.get('window');

export default function MapViewScreen() {
  const [selected, setSelected] = useState<number | null>(null);
  const [pins, setPins] = useState<CrowdMapPin[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [autoSend, setAutoSend] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(60); // 60 seconds

  const {
    state: locationState,
    requestPermission,
    getCurrentLocation,
    startAutoSend,
    stopAutoSend,
  } = useLocationTracking({
    onLocationUpdate: (coords) => {
      console.log('Location updated on map:', coords);
      // Refresh locations data when user location is updated
      fetchLocations();
    },
    onError: (error) => {
      console.error('Map location error:', error);
      setErrorMsg(error);
    },
    updateIntervalMs: intervalSeconds * 1000,
  });

  const mapW = Dimensions.get('window').width;
  const mapH = Dimensions.get('window').height * 0.78;

  useEffect(() => {
    fetchLocations();
  }, []);

  // Start/stop auto-send when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (autoSend) {
        startAutoSend(intervalSeconds * 1000);
      }
      return () => {
        stopAutoSend();
      };
    }, [autoSend, intervalSeconds, startAutoSend, stopAutoSend])
  );

  const fetchLocations = async () => {
    try {
      const res = await api.get<CrowdLocationApiResponse[]>('/crowd/locations');
      if (Array.isArray(res.data)) {
        const locs = res.data;
        const lats = locs.map((l) => l.latitude);
        const lons = locs.map((l) => l.longitude);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const mapped: CrowdMapPin[] = locs.map((l, i) => {
          const x = (l.longitude - minLon) / (maxLon - minLon || 1);
          const y = 1 - (l.latitude - minLat) / (maxLat - minLat || 1);
          return {
            id: l.location_id,
            x,
            y,
            color:
              l.occupancy_percentage >= 80
                ? '#F59E0B'
                : l.occupancy_percentage >= 40
                  ? '#3B82F6'
                  : '#9CA3AF',
            icon: '👥',
            label: l.location_name,
            raw: l,
            isMain: i === 0,
          };
        });

        setPins(mapped);
        setErrorMsg(null);
      }
    } catch (e) {
      console.log('Failed to fetch locations', e);
      setErrorMsg('Failed to load locations');
    }
  };

  const handleSendLocation = async () => {
    // Check permission and get location
    if (locationState.permissionState !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setErrorMsg('Location permission required');
        return;
      }
    }

    const coords = await getCurrentLocation();
    if (!coords) {
      setErrorMsg('Unable to get location');
      return;
    }

    // Refresh locations after sending
    fetchLocations();
  };

  const mainPin = selected !== null ? pins.find((p: CrowdMapPin) => p.id === selected) : pins.length > 0 ? pins[0] : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={handleSendLocation}>
          <Text style={styles.navIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* Map Area */}
      <View style={[styles.mapContainer, { height: mapH }]}>
        {/* Simulated map background */}
        <View style={styles.mapBg}>
          {/* Water area */}
          <View style={styles.waterLeft} />
          <View style={styles.waterRight} />

          {/* Land mass - peninsula shape */}
          <View style={styles.land} />

          {/* Roads simulation */}
          <View style={[styles.road, { top: '30%', left: '20%', width: '60%', height: 2 }]} />
          <View style={[styles.road, { top: '45%', left: '30%', width: '40%', height: 2 }]} />
          <View style={[styles.road, { top: '55%', left: '25%', width: '50%', height: 2 }]} />
          <View style={[styles.road, { top: '30%', left: '45%', width: 2, height: '40%' }]} />
          <View style={[styles.road, { top: '25%', left: '35%', width: 2, height: '35%' }]} />

          {/* Highlight ring around main location (if any) */}
          {pins[0] && (
            <View
              style={[
                styles.ringOuter,
                {
                  left: pins[0].x * mapW - 90,
                  top: pins[0].y * mapH - 90,
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                },
              ]}
            />
          )}

          {/* Pins */}
          {pins.map((pin: CrowdMapPin) => (
            <TouchableOpacity
              key={pin.id}
              style={[
                styles.pin,
                {
                  left: pin.x * mapW - (pin.isMain ? 24 : 18),
                  top: pin.y * mapH - (pin.isMain ? 24 : 18),
                  width: pin.isMain ? 48 : 36,
                  height: pin.isMain ? 48 : 36,
                  borderRadius: pin.isMain ? 24 : 18,
                  backgroundColor: pin.color,
                  borderWidth: pin.isMain ? 3 : 0,
                  borderColor: '#FFFFFF',
                },
              ]}
              onPress={() => setSelected(pin.id)}
            >
              <Text style={[styles.pinIcon, { fontSize: pin.isMain ? 22 : 16 }]}>
                {pin.icon}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Popup callout for main or selected pin */}
          {mainPin && (
            <View
              style={[
                styles.callout,
                {
                  left: mainPin.x * mapW - 110,
                  top: mainPin.y * mapH - 120,
                },
              ]}
            >
              <View style={styles.calloutHeader}>
                <Text style={styles.calloutTitle}>{mainPin.label}</Text>
                <View style={styles.calloutBadge}>
                  <Text style={styles.calloutBadgeText}>⚠ {mainPin.raw?.crowd_status ?? 'LOW'}</Text>
                </View>
              </View>
              <Text style={styles.calloutCount}>
                <Text style={styles.calloutBig}>{mainPin.raw?.crowd_count ?? 0}</Text>
                <Text style={styles.calloutSub}> people</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>DENSITY</Text>
          {[
            { color: '#F59E0B', label: 'High (>300)' },
            { color: '#3B82F6', label: 'Med (100-300)' },
            { color: '#9CA3AF', label: 'Low (<100)' },
          ].map((item, i) => (
            <View key={i} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
      {/* Bottom controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, autoSend && styles.controlBtnActive]}
          onPress={() => setAutoSend(!autoSend)}
        >
          <Text style={styles.controlBtnText}>{autoSend ? 'Auto-Send: ON' : 'Auto-Send: OFF'}</Text>
        </TouchableOpacity>
        <View style={styles.intervalRow}>
          {[30, 60, 120, 300].map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.intervalBtn, intervalSeconds === s && styles.intervalBtnActive]}
              onPress={() => setIntervalSeconds(s)}
            >
              <Text style={[styles.intervalText, intervalSeconds === s && styles.intervalTextActive]}>
                {s < 60 ? s + 's' : Math.round(s / 60) + 'm'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  navBtn: {
    padding: 4,
  },
  navArrow: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '600',
  },
  navIcon: {
    fontSize: 20,
    color: '#6B7280',
  },

  mapContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#C8DFF0',
  },
  waterLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '18%',
    height: '100%',
    backgroundColor: '#B0CEE8',
  },
  waterRight: {
    position: 'absolute',
    right: 0,
    top: '40%',
    width: '20%',
    height: '60%',
    backgroundColor: '#B0CEE8',
  },
  land: {
    position: 'absolute',
    left: '15%',
    top: '10%',
    width: '70%',
    height: '85%',
    backgroundColor: '#E8ECD8',
    borderRadius: 30,
  },
  road: {
    position: 'absolute',
    backgroundColor: '#D1D5DB',
  },
  ringOuter: {
    position: 'absolute',
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(245,158,11,0.5)',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinIcon: {
    textAlign: 'center',
  },
  callout: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    width: 170,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  calloutBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  calloutBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  calloutCount: {
    marginTop: 4,
  },
  calloutBig: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1E2A5E',
  },
  calloutSub: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  legend: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 140,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#374151',
  },
  controls: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  controlBtn: {
    backgroundColor: '#EEF2FF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  controlBtnActive: {
    backgroundColor: '#1E40AF'
  },
  controlBtnText: {
    color: '#1E2A5E',
    fontWeight: '700'
  },
  intervalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  intervalBtn: { padding: 8, borderRadius: 8, backgroundColor: '#F3F4F6', minWidth: 48, alignItems: 'center' },
  intervalBtnActive: { backgroundColor: '#1E40AF' },
  intervalText: { color: '#374151', fontWeight: '700' },
  intervalTextActive: { color: '#FFFFFF' },
});
