import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { CrowdLocationApiResponse, CrowdStackParamList } from './types';

const BAR_DATA = [0.35, 0.5, 0.65, 0.55, 0.75, 1.0];
const BAR_COLORS = ['#BFCBF7', '#BFCBF7', '#F4BBBB', '#F9C5C5', '#F4BBBB', '#B91C1C'];

const CrowdBar = ({ value, color, isLast }: { value: number; color: string; isLast: boolean }) => (
  <View style={styles.barWrapper}>
    <View style={[styles.bar, { height: value * 90, backgroundColor: color }]} />
  </View>
);

export default function LocationDetailScreen() {
  const route = useRoute<RouteProp<CrowdStackParamList, 'CrowdLocationDetail'>>();
  const location: CrowdLocationApiResponse | null = route.params?.location ?? null;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#5B6FA6" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Header Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroOverlay} />
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{location?.location_name ?? 'Location'}</Text>
            <Text style={styles.heroSub}>📍 {location?.latitude ?? ''}, {location?.longitude ?? ''}</Text>
          </View>
        </View>

        {/* Live Crowd Status */}
        <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <View>
              <Text style={styles.cardTitle}>Live Crowd Status</Text>
              <Text style={styles.updatedText}>🔴 Updated now</Text>
            </View>
            <View style={styles.highBadge}>
              <Text style={styles.highBadgeText}>👥 {location?.crowd_status ?? 'LOW'}</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Current Occupancy</Text>
              <Text style={styles.occupancyValue}>{location?.occupancy_percentage ?? '0'}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Estimated People</Text>
              <Text style={styles.peopleValue}>
                <Text style={styles.peopleBig}>{location?.crowd_count ?? 0}</Text>
                <Text style={styles.peopleMax}> / {location?.capacity ?? '-'}</Text>
              </Text>
            </View>
          </View>

          {/* Crowd Trend */}
          <Text style={styles.trendLabel}>Crowd Trend (Last 6 Hours)</Text>
          <View style={styles.chartArea}>
            <View style={styles.barsContainer}>
              {BAR_DATA.map((val, i) => (
                <CrowdBar key={i} value={val} color={BAR_COLORS[i]} isLast={i === BAR_DATA.length - 1} />
              ))}
            </View>
            <View style={styles.chartXAxis}>
              <Text style={styles.axisText}>12 PM</Text>
              <Text style={styles.axisText}>Now</Text>
            </View>
          </View>
        </View>

        {/* Monitoring Zone */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monitoring Zone</Text>
          <View style={styles.mapPlaceholder}>
            {/* Map simulation */}
            <View style={styles.mapBg}>
              <View style={styles.mapRingOuter}>
                <View style={styles.mapRingMiddle}>
                  <View style={styles.mapDot} />
                </View>
              </View>
              <Text style={styles.mapLabel}>{location?.location_name ?? 'Location'}</Text>
            </View>
          </View>
          <View style={styles.zoneInfoRow}>
            <Text style={styles.zoneKey}>Radius</Text>
            <Text style={styles.zoneVal}>500m</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.zoneInfoRow}>
            <Text style={styles.zoneKey}>Zone Type</Text>
            <Text style={styles.zoneVal}>Public Monument</Text>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity style={styles.alertBtn}>
          <Text style={styles.alertIcon}>🔔</Text>
          <Text style={styles.alertBtnText}>Set Crowd Alert</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEEEF6',
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 40 },

  // Hero
  hero: {
    height: 220,
    backgroundColor: '#4A5C8A',
    justifyContent: 'flex-end',
    padding: 20,
    marginBottom: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,30,60,0.35)',
  },
  heroText: { zIndex: 5 },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 14,
    color: '#F0C97A',
  },

  // Cards
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  updatedText: {
    fontSize: 13,
    color: '#6B7280',
  },
  highBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  highBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  occupancyValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EF4444',
  },
  peopleValue: {
    fontSize: 14,
  },
  peopleBig: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  peopleMax: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Chart
  trendLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  chartArea: {
    paddingTop: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    borderRadius: 4,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  axisText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Map
  mapPlaceholder: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
  },
  mapBg: {
    flex: 1,
    backgroundColor: '#B8D4E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapRingOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(239,68,68,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.4)',
  },
  mapRingMiddle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239,68,68,0.5)',
  },
  mapDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
  },
  mapLabel: {
    position: 'absolute',
    bottom: 10,
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },

  // Zone info
  zoneInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  zoneKey: {
    fontSize: 14,
    color: '#6B7280',
  },
  zoneVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },

  // Alert button
  alertBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: '#1E2A5E',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  alertIcon: {
    fontSize: 18,
  },
  alertBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
