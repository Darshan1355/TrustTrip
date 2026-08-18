import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "../config/api";

type Complaint = { id: number; category: string; status?: string; created_at: string };
type GuideShort = { g_id: number; name: string; rating: number; status: string };
type Order = { id: number; name: string; total_price: number; status: string };

// ---- Design tokens (kept local so no other files need to change) ----
const COLORS = {
  bg: "#EEF3FC",
  card: "#FFFFFF",
  primary: "#1E4FD6",
  primaryDark: "#0B1C30",
  teal: "#0F5E6B",
  red: "#D6303F",
  redBg: "#FCE9EA",
  textMuted: "#6B7280",
  border: "#EEF1F6",
};

export default function DashboardScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bookedGuides, setBookedGuides] = useState<GuideShort[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const userRaw = await AsyncStorage.getItem("user");
      if (!userRaw) return;
      const user = JSON.parse(userRaw);
      const username = user.username;
      const user_id = user.id;

      // Parallel requests — UNCHANGED
      const [complaintsRes, guidesRes, ordersRes] = await Promise.all([
        api.get(`/user-complaints/${username}`),
        api.get(`/guides`, { params: { username } }),
        api.get(`/user-orders/${user_id}`),
      ]);

      setComplaints(Array.isArray(complaintsRes.data) ? complaintsRes.data : []);

      const allGuides = Array.isArray(guidesRes.data) ? guidesRes.data : [];
      const booked = allGuides.filter((g: any) => g.booked_by_user).map((g: any) => ({
        g_id: g.g_id,
        name: g.name,
        rating: Number(g.rating || 0),
        status: g.status,
      }));
      setBookedGuides(booked);

      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to load dashboard data");
    }
  };

  // ---- Derived analytics from existing complaints data (no backend change) ----
  const analytics = useMemo(() => {
    const total = complaints.length;
    const norm = (s?: string) => (s || "pending").toLowerCase();
    const resolved = complaints.filter((c) => norm(c.status).includes("resolved")).length;
    const rejected = complaints.filter((c) => norm(c.status).includes("reject")).length;
    const pending = total - resolved - rejected;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
    return {
      total,
      resolvedPct: pct(resolved),
      pendingPct: pct(pending),
      rejectedPct: pct(rejected),
      criticalCount: complaints.filter((c) => norm(c.status).includes("critical")).length,
    };
  }, [complaints]);

  const recentActivity = useMemo(() => {
    // Merge the three data sources into one lightweight feed, newest-first-ish
    const items: { id: string; label: string; meta: string; tone: "blue" | "purple" | "red" | "gray" }[] = [];
    complaints.slice(0, 2).forEach((c) =>
      items.push({
        id: `c-${c.id}`,
        label: `Complaint #${c.id} — ${c.status || "Pending"}`,
        meta: c.category,
        tone: (c.status || "").toLowerCase().includes("resolved") ? "blue" : "gray",
      })
    );
    bookedGuides.slice(0, 1).forEach((g) =>
      items.push({ id: `g-${g.g_id}`, label: `Guide booked — ${g.name}`, meta: g.status, tone: "purple" })
    );
    orders.slice(0, 1).forEach((o) =>
      items.push({ id: `o-${o.id}`, label: `Order #${o.id} — ${o.status}`, meta: o.name, tone: "gray" })
    );
    return items;
  }, [complaints, bookedGuides, orders]);

  // Order Insights bar data — Order type has no per-day breakdown, so this is
  // presentational placeholder data per the design spec. Wire to a real
  // `/order-insights` endpoint later without touching this component's shape.
  const weekBars = [40, 55, 70, 48, 82, 95, 60];
  const weekLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const peakIndex = weekBars.indexOf(Math.max(...weekBars));
  const deliveredCount = orders.filter((o) => o.status?.toLowerCase() === "delivered").length;
  const cancelledCount = orders.filter((o) => o.status?.toLowerCase() === "cancelled").length;

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.category}</Text>
      <Text style={styles.itemMeta}>{item.status || "Pending"}</Text>
    </View>
  );

  const renderGuide = ({ item }: { item: GuideShort }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Guide")}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemMeta}>⭐ {item.rating.toFixed(1)} • {item.status}</Text>
    </TouchableOpacity>
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("MyOrders")}>
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemMeta}>₹{Number(item.total_price).toLocaleString()} • {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <TouchableOpacity onPress={loadAll} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* SOS Alert Banner */}
        {analytics.criticalCount > 0 && (
          <View style={styles.sosBanner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>Active SOS Alerts</Text>
              <Text style={styles.sosSubtitle}>
                {analytics.criticalCount} critical incident{analytics.criticalCount > 1 ? "s" : ""} requiring
                immediate attention
              </Text>
            </View>
            <TouchableOpacity style={styles.sosBtn} onPress={() => navigation.navigate("MyComplaints")}>
              <Text style={styles.sosBtnText}>Respond Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("MyComplaints")}>
            <Text style={styles.summaryLabelTop}>COMPLAINTS</Text>
            <Text style={styles.summaryNum}>{complaints.length}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("MyComplaints")}>
            <Text style={styles.summaryLabelTop}>PENDING</Text>
            <Text style={styles.summaryNum}>{analytics.pendingPct > 0 ? complaints.length - (complaints.length - Math.round((analytics.pendingPct / 100) * complaints.length)) : 0}</Text>
          </TouchableOpacity>
        </View>

        {/* Report Analytics donut (View-based, no svg dependency) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Report Analytics</Text>
          <Text style={styles.cardSubtitle}>Monthly resolution performance</Text>

          <View style={styles.donutRow}>
            <View style={styles.donutOuter}>
              <View style={styles.donutInner}>
                <Text style={styles.donutTotal}>{analytics.total}</Text>
                <Text style={styles.donutTotalLabel}>TOTAL</Text>
              </View>
            </View>
          </View>

          <LegendRow color={COLORS.primary} label="Resolved" pct={analytics.resolvedPct} />
          <LegendRow color={COLORS.teal} label="Pending" pct={analytics.pendingPct} />
          <LegendRow color={COLORS.red} label="Rejected" pct={analytics.rejectedPct} />
        </View>

        {/* Recent Activity feed */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          {recentActivity.length === 0 ? (
            <Text style={styles.empty}>No recent activity</Text>
          ) : (
            recentActivity.map((item) => (
              <View key={item.id} style={styles.activityRow}>
                <View style={[styles.activityDot, { backgroundColor: toneColor(item.tone) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{item.label}</Text>
                  <Text style={styles.itemMeta}>{item.meta}</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Original Recent Reports list — kept intact, just restyled via `card` */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Recent Reports</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyComplaints")}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={complaints.slice(0, 3)}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderComplaint}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.empty}>No reports</Text>}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Booked Guides</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Guide")}>
              <Text style={styles.link}>Manage</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bookedGuides.slice(0, 3)}
            keyExtractor={(i) => String(i.g_id)}
            renderItem={renderGuide}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.empty}>No booked guides</Text>}
          />
        </View>

        {/* Order Insights */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Insights</Text>
          <Text style={styles.cardSubtitle}>Growth and status distribution</Text>

          <View style={styles.barChartWrap}>
            {weekBars.map((h, i) => (
              <View key={weekLabels[i]} style={styles.barCol}>
                {i === peakIndex && (
                  <View style={styles.peakBadge}>
                    <Text style={styles.peakBadgeText}>Peak</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.bar,
                    { height: h, backgroundColor: i === peakIndex ? COLORS.primary : "#C7D6F5" },
                  ]}
                />
                <Text style={styles.barLabel}>{weekLabels[i]}</Text>
              </View>
            ))}
          </View>

          <View style={styles.insightRow}>
            <Text style={styles.itemMeta}>DELIVERED</Text>
            <Text style={styles.insightNum}>{deliveredCount || orders.length}</Text>
          </View>
          <View style={styles.insightRow}>
            <Text style={styles.itemMeta}>CANCELLED</Text>
            <Text style={styles.insightNum}>{cancelledCount}</Text>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.cardTitle}>Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyOrders")}>
              <Text style={styles.link}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={orders.slice(0, 3)}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderOrder}
            scrollEnabled={false}
            ListEmptyComponent={<Text style={styles.empty}>No recent orders</Text>}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function LegendRow({ color, label, pct }: { color: string; label: string; pct: number }) {
  return (
    <View style={styles.legendRow}>
      <View style={styles.legendLeft}>
        <View style={[styles.legendDot, { backgroundColor: color }]} />
        <Text style={styles.itemTitle}>{label}</Text>
      </View>
      <Text style={styles.itemMeta}>{pct}%</Text>
    </View>
  );
}

function toneColor(tone: "blue" | "purple" | "red" | "gray") {
  switch (tone) {
    case "blue":
      return COLORS.primary;
    case "purple":
      return "#7C5CFC";
    case "red":
      return COLORS.red;
    default:
      return COLORS.textMuted;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "800", color: COLORS.primaryDark },
  refreshBtn: { padding: 8 },
  refreshText: { color: COLORS.primary, fontWeight: "600" },

  sosBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.redBg,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sosTitle: { color: COLORS.red, fontWeight: "800", fontSize: 16 },
  sosSubtitle: { color: COLORS.red, fontSize: 12, marginTop: 4, opacity: 0.8 },
  sosBtn: { backgroundColor: COLORS.red, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  sosBtnText: { color: "#fff", fontWeight: "700", fontSize: 12 },

  summaryRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 16, gap: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryLabelTop: { fontSize: 11, color: COLORS.textMuted, fontWeight: "700", marginBottom: 6 },
  summaryNum: { fontSize: 24, fontWeight: "800", color: COLORS.primaryDark },

  card: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.primaryDark },
  cardSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, marginBottom: 12 },

  donutRow: { alignItems: "center", marginVertical: 12 },
  donutOuter: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 18,
    borderColor: COLORS.primary,
    borderRightColor: COLORS.teal,
    borderBottomColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
  },
  donutInner: { alignItems: "center" },
  donutTotal: { fontSize: 22, fontWeight: "800", color: COLORS.primaryDark },
  donutTotalLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 },

  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  legendLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },

  activityRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 8 },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  link: { color: COLORS.primary, fontWeight: "600" },

  listItem: {
    backgroundColor: COLORS.bg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: { fontWeight: "700", color: COLORS.primaryDark },
  itemMeta: { color: COLORS.textMuted, fontSize: 12 },
  empty: { color: "#9CA3AF", padding: 12 },

  barChartWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    marginTop: 8,
    marginBottom: 12,
  },
  barCol: { alignItems: "center", flex: 1 },
  bar: { width: 18, borderRadius: 6 },
  barLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },
  peakBadge: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  peakBadgeText: { color: "#fff", fontSize: 9, fontWeight: "700" },

  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
  },
  insightNum: { fontWeight: "800", fontSize: 16, color: COLORS.primaryDark },
});