import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/api";

type Complaint = {
  id: number;
  category: string;
  description: string;
  latitude: string | number;
  longitude: string | number;
  status?: string;
  created_at: string;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "WOMEN SAFETY":   { bg: "#EDE9FE", text: "#6D28D9" },
  "OVERPRICING":    { bg: "#D1FAE5", text: "#065F46" },
  "INFRASTRUCTURE": { bg: "#DBEAFE", text: "#1E40AF" },
  "SCAM":           { bg: "#FEF3C7", text: "#92400E" },
  "HARASSMENT":     { bg: "#FCE7F3", text: "#9D174D" },
  DEFAULT:          { bg: "#F3F4F6", text: "#374151" },
};

function getCategoryColor(cat: string) {
  const key = cat.toUpperCase();
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.DEFAULT;
}

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  "pending review": { bg: "#FEF3C7", text: "#D97706" },
  "resolved":       { bg: "#D1FAE5", text: "#059669" },
  "in progress":    { bg: "#DBEAFE", text: "#2563EB" },
  "rejected":       { bg: "#FEE2E2", text: "#DC2626" },
};

function getStatusStyle(status: string) {
  return STATUS_STYLES[status?.toLowerCase()] || { bg: "#F3F4F6", text: "#6B7280" };
}

function formatStatus(status?: string) {
  if (!status) return "Pending Review";
  return status
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const FILTERS = ["All Reports", "Pending", "Resolved"];

export default function MyComplaintsScreen() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Reports");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    const user = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(user || "{}");
    const username = parsed.username;
    const res = await api.get(`/user-complaints/${username}`);
    setComplaints(res.data);
  };

  const filtered = complaints.filter((c) => {
    if (activeFilter === "All Reports") return true;
    if (activeFilter === "Pending")
      return (
        !c.status ||
        c.status.toLowerCase().includes("pending") ||
        c.status.toLowerCase().includes("progress")
      );
    if (activeFilter === "Resolved")
      return c.status?.toLowerCase().includes("resolved");
    return true;
  });

  const renderItem = ({ item }: { item: Complaint }) => {
    const catColor = getCategoryColor(item.category);
    const status = item.status || "Pending Review";
    const statusStyle = getStatusStyle(status);

    return (
      <View style={styles.card}>
        {/* Top badges row */}
        <View style={styles.badgesRow}>
          <View style={[styles.catBadge, { backgroundColor: catColor.bg }]}>
            <Text style={[styles.catText, { color: catColor.text }]}>
              {item.category.toUpperCase()}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {formatStatus(status)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.desc} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Footer row */}
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>📍</Text>
            <Text style={styles.footerText} numberOfLines={1}>
              {item.latitude}, {item.longitude}
            </Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={styles.footerIcon}>📅</Text>
            <Text style={styles.footerText}>{formatDate(item.created_at)}</Text>
          </View>
          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Details ›</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>My Reports</Text>
        <Text style={styles.heroSub}>
          Track and manage your community reports and safety alerts to help keep travelers safe.
        </Text>
      </View>

      {/* White panel */}
      <View style={styles.panel}>
        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === f && styles.filterTabTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyTitle}>No Reports Found</Text>
              <Text style={styles.emptySub}>
                Reports you submit will appear here.
              </Text>
            </View>
          }
        />
      </View>

    </SafeAreaView>
  );
}

const INDIGO = "#2A3BAF";
const INDIGO_DARK = "#1E2D8C";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: INDIGO,
  },

  hero: {
    backgroundColor: INDIGO,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroSub: {
    color: "#BEC8EF",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
  },

  // White rounded panel
  panel: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    overflow: "hidden",
  },

  // Filter row
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
  },
  filterTabActive: {
    backgroundColor: INDIGO,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#1a2060",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  catText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  desc: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
    marginBottom: 14,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
    gap: 10,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  footerIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
  },
  detailsBtn: {
    paddingLeft: 8,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: INDIGO,
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    marginTop: 70,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#374151",
    marginTop: 14,
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 40,
  },


});
