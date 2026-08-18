import React, { useState, useEffect } from 'react';
import { useRoute, type RouteProp } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import api from '../../config/api';
import type {
  CrowdHistoryDataPoint,
  CrowdLocationApiResponse,
  CrowdStackParamList,
  CrowdTrendPoint,
} from './types';

const { width } = Dimensions.get('window');

const TABS = ['Today', '24H', '7D'];

const CHART_DATA = [
  { label: '10:00', value: 0.35, isHighlight: false },
  { label: '10:30', value: 0.6, isHighlight: false },
  { label: '11:00', value: 0.85, isHighlight: true },
  { label: '11:30', value: 0.65, isHighlight: false },
  { label: '12:00', value: 0.3, isHighlight: false },
];

const PEAK_TIMES: Array<{ time: string; level: 'HIGH' | 'MODERATE' | 'LOW' }> = [
  { time: '11:00 AM - 12:30 PM', level: 'HIGH' },
  { time: '3:00 PM - 5:00 PM', level: 'HIGH' },
];

// Simple curve approximation using rectangles & SVG-like overlay
const ChartBars = ({ data }: { data: CrowdTrendPoint[] }) => {
  const chartH = 140;
  const barW = (width - 64) / data.length - 8;

  return (
    <View style={styles.chartContainer}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        <Text style={styles.yLabel}>Hi</Text>
        <Text style={styles.yLabel}>Med</Text>
        <Text style={styles.yLabel}>Lo</Text>
      </View>

      {/* Bars */}
      <View style={styles.barsArea}>
        <View style={[styles.barsRow, { height: chartH }]}>
          {data.map((item: CrowdTrendPoint, i: number) => (
            <View key={i} style={styles.barColumn}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: item.value * chartH,
                      width: barW,
                      backgroundColor: item.isHighlight ? '#FBCFCF' : '#C7D2F9',
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Curve overlay (visual approximation) */}
        <View style={styles.curveOverlay} pointerEvents="none">
          <Text style={styles.curveLine}>〜〜〜〜〜〜〜〜〜〜</Text>
        </View>

        {/* X-axis */}
        <View style={styles.xAxis}>
          {data.map((item: CrowdTrendPoint, i: number) => (
            <Text key={i} style={[styles.xLabel, { width: barW + 8 }]}>
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default function HistoryScreen() {
  const route = useRoute<RouteProp<CrowdStackParamList, 'CrowdHistory'>>();
  const location: CrowdLocationApiResponse | null = route.params?.location ?? null;
  const [activeTab, setActiveTab] = useState<number>(0);
  const [historyData, setHistoryData] = useState<CrowdHistoryDataPoint[]>([]);

  useEffect(() => {
    if (location) fetchHistory();
  }, [location]);

  const fetchHistory = async () => {
    if (!location) {
      return;
    }

    try {
      const res = await api.get<CrowdHistoryDataPoint[]>(`/crowd/history/${location.location_id}`);
      if (Array.isArray(res.data)) setHistoryData(res.data);
    } catch (e) {
      console.log('history fetch error', e);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEEEF6" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Back button row */}
        <TouchableOpacity style={styles.backRow}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Analyze crowd trends and peak times.</Text>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tab, activeTab === i && styles.tabActive]}
              onPress={() => setActiveTab(i)}
            >
              <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Crowd Density Chart Card */}
          <View style={styles.card}>
          <View style={styles.cardTopRow}>
            <Text style={styles.cardTitle}>Crowd Density</Text>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE DATA</Text>
            </View>
          </View>
          <ChartBars data={CHART_DATA} />
          {historyData.length>0 && (
            <View style={{marginTop:12}}>
              {historyData.map((h,i)=> (
                <View key={i} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:6}}>
                  <Text style={{color:'#374151'}}>{new Date(h.created_at).toLocaleString()}</Text>
                  <Text style={{color:'#374151'}}>{h.crowd_count} ({h.occupancy_percentage}%)</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Current Trend Card */}
        <View style={styles.card}>
          <View style={styles.trendIconRow}>
            <Text style={styles.trendIcon}>↘</Text>
            <Text style={styles.trendSectionTitle}>Current Trend</Text>
          </View>
          <View style={styles.trendValueRow}>
            <Text style={styles.trendValue}>Decreasing</Text>
            <View style={styles.trendBadge}>
              <Text style={styles.trendBadgeText}>-15% from last hour</Text>
            </View>
          </View>
        </View>

        {/* Peak Times Card */}
        <View style={styles.card}>
          <View style={styles.peakHeaderRow}>
            <Text style={styles.peakClockIcon}>🕐</Text>
            <Text style={styles.cardTitle}>Peak Times</Text>
          </View>
          {PEAK_TIMES.map((item, i) => (
            <View key={i} style={[styles.peakRow, i < PEAK_TIMES.length - 1 && styles.peakBorder]}>
              <Text style={styles.peakTime}>{item.time}</Text>
              <View style={styles.peakHighBadge}>
                <Text style={styles.peakHighText}>👥 {item.level}</Text>
              </View>
            </View>
          ))}
        </View>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  backRow: {
    marginBottom: 10,
  },
  backArrow: {
    fontSize: 22,
    color: '#111827',
    fontWeight: '600',
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

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    padding: 4,
    marginBottom: 18,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#1E2A5E',
  },

  // Card
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 5,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },

  // Chart
  chartContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginRight: 6,
    height: 140,
  },
  yLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  barsArea: {
    flex: 1,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  barColumn: {
    flex: 1,
    height: '100%',
  },
  chartBar: {
    borderRadius: 6,
  },
  curveOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  curveLine: {
    fontSize: 16,
    color: '#6366F1',
    letterSpacing: -2,
    opacity: 0.7,
  },
  xAxis: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  xLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Trend
  trendIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    marginRight: 6,
  },
  trendSectionTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  trendValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trendValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  trendBadge: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  trendBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
  },

  // Peak times
  peakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  peakClockIcon: {
    fontSize: 16,
  },
  peakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  peakBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  peakTime: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  peakHighBadge: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  peakHighText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },
});
