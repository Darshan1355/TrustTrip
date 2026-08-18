import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation, type NavigationProp } from '@react-navigation/native';
import api from '../../config/api';
import useLocationTracking from '../../hooks/useLocationTracking';
import LocationPermissionCard from '../../components/LocationPermissionCard';
import locationService from '../../services/locationService';
import type {
  CrowdLocationApiResponse,
  CrowdLocationCardItem,
  CrowdStackParamList,
  CrowdStatus,
} from './types';

const defaultLocations: CrowdLocationCardItem[] = [];

const levelBadgeStyle = (level: CrowdStatus) => {
  if (level === 'HIGH') return { bg: '#FEF3C7', text: '#B45309' };
  if (level === 'MODERATE') return { bg: '#EEF2FF', text: '#4338CA' };
  return { bg: '#F3F4F6', text: '#374151' };
};

const LocationCard = ({ item }: { item: CrowdLocationCardItem }) => {
  const badge = levelBadgeStyle(item.level);
  const percentText = `${item.percent}% Full`;
  const percentColor =
    item.level === 'HIGH' ? '#F59E0B' : item.level === 'MODERATE' ? '#3B82F6' : '#374151';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.locationName}>{item.name}</Text>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={styles.badgeIcon}>👥 </Text>
            <Text style={[styles.badgeText, { color: badge.text }]}>{item.level}</Text>
          </View>
          <View style={[styles.dot, { backgroundColor: item.dotColor }]} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.currentCount}>
          <Text style={styles.bigNumber}>{item.current}</Text>
          <Text style={styles.maxNumber}>/{item.max}</Text>
        </Text>
        <Text style={[styles.percentText, { color: percentColor }]}>{percentText}</Text>
      </View>
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${item.percent}%`, backgroundColor: item.barColor },
          ]}
        />
      </View>
    </View>
  );
};

export default function CrowdMonitoringScreen() {
  const [locations, setLocations] = useState<CrowdLocationCardItem[]>(defaultLocations);
  const [autoLocationTracking, setAutoLocationTracking] = useState(false);
  const [locationUpdateInterval, setLocationUpdateInterval] = useState(60000); // 60 seconds
  const navigation = useNavigation<NavigationProp<CrowdStackParamList>>();

  const {
    state: locationState,
    requestPermission,
    getCurrentLocation,
    startAutoSend,
    stopAutoSend,
  } = useLocationTracking({
    onLocationUpdate: (coords) => {
      console.log('Location updated:', coords);
      // Location is automatically sent to backend via startAutoSend
    },
    onError: (error) => {
      console.error('Location error:', error);
      // Show error to user
      if (autoLocationTracking) {
        Alert.alert('Location Error', error);
      }
    },
  });

  // Fetch crowd locations
  useEffect(() => {
    fetchLocations();
  }, []);

  // Start/stop location tracking when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (autoLocationTracking) {
        startAutoSend(locationUpdateInterval);
      }

      return () => {
        stopAutoSend();
      };
    }, [autoLocationTracking, locationUpdateInterval, startAutoSend, stopAutoSend])
  );

  const fetchLocations = async () => {
    try {
      const res = await api.get<CrowdLocationApiResponse[]>('/crowd/locations');
      if (Array.isArray(res.data)) {
        const mapped: CrowdLocationCardItem[] = res.data.map((r) => ({
          name: r.location_name,
          current: r.crowd_count,
          max: r.capacity,
          percent: r.occupancy_percentage,
          level: r.crowd_status,
          dotColor: r.occupancy_percentage >= 80 ? '#EF4444' : '#10B981',
          barColor: r.occupancy_percentage >= 80 ? '#F59E0B' : '#3B82F6',
          raw: r,
        }));

        setLocations(mapped);
      }
    } catch (e) {
      console.log('Failed to fetch crowd locations', e);
    }
  };

  const handlePermissionGranted = () => {
    console.log('Location permission granted');
    setAutoLocationTracking(true);
  };

  const handlePermissionDenied = () => {
    console.log('Location permission denied');
    setAutoLocationTracking(false);
  };

  const openDetail = (loc: CrowdLocationCardItem) => {
    navigation.navigate('CrowdLocationDetail', { location: loc.raw });
  };
  

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEEEF6" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Crowd Monitoring</Text>
        <Text style={styles.subtitle}>Real-time occupancy data for popular destinations.</Text>

        {/* Location Permission Card */}
        <LocationPermissionCard
          permissionState={locationState.permissionState}
          status={locationState.status}
          onRequestPermission={requestPermission}
          onPermissionGranted={handlePermissionGranted}
          onPermissionDenied={handlePermissionDenied}
          errorMessage={locationState.error}
          visible={true}
        />

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.activeDot,
                {
                  backgroundColor:
                    locationState.isTracking && autoLocationTracking ? '#10B981' : '#EF4444',
                },
              ]}
            />
            <Text style={styles.statusTitle}>
              {locationState.isTracking && autoLocationTracking
                ? 'Location: Tracking Active'
                : 'Location: Tracking Inactive'}
            </Text>
          </View>
          <View style={styles.statusMeta}>
            <Text style={styles.metaText}>🕐 Last updated: {locationState.lastUpdateTime ? new Date(locationState.lastUpdateTime).toLocaleTimeString() : 'Never'}</Text>
            <Text style={styles.metaText}>🕐 Updates every {Math.round(locationUpdateInterval / 1000)}s</Text>
          </View>
        </View>

        {/* Location Cards */}
        {locations.map((item, idx) => (
          <View key={idx}>
            <TouchableOpacity onPress={() => openDetail(item)}>
              <LocationCard item={item} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEEEF6',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E2A5E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  statusMeta: {
    flexDirection: 'row',
    gap: 20,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeIcon: {
    fontSize: 11,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  currentCount: {
    flexDirection: 'row',
  },
  bigNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1E40AF',
  },
  maxNumber: {
    fontSize: 16,
    fontWeight: '400',
    color: '#9CA3AF',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '600',
  },
  progressBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
});
