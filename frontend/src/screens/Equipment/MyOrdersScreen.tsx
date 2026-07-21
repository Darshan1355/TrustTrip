import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/api";

type Order = {
  id: number;
  name: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
};

const EQUIPMENT_ICONS: Record<string, string> = {
  vest: "🛡️",
  kit: "🧰",
  flashlight: "🔦",
  helmet: "⛑️",
  glove: "🧤",
  default: "📦",
};

function getIcon(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(EQUIPMENT_ICONS)) {
    if (lower.includes(key)) return EQUIPMENT_ICONS[key];
  }
  return EQUIPMENT_ICONS.default;
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return {
        badge: styles.statusPending,
        dot: styles.dotPending,
        text: styles.statusTextPending,
      };
    case "delivered":
      return {
        badge: styles.statusDelivered,
        dot: styles.dotDelivered,
        text: styles.statusTextDelivered,
      };
    case "cancelled":
      return {
        badge: styles.statusCancelled,
        dot: styles.dotCancelled,
        text: styles.statusTextCancelled,
      };
    default:
      return {
        badge: styles.statusPending,
        dot: styles.dotPending,
        text: styles.statusTextPending,
      };
  }
}

function formatOrderId(id: number) {
  return `#TT-${String(id).padStart(5, "0")}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }
      const parsedUser = JSON.parse(user);
      const user_id = parsedUser.id;
      const res = await api.get(`/user-orders/${user_id}`);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load orders");
    }
  };

  const renderItem = ({ item }: { item: Order }) => {
    const statusStyle = getStatusStyle(item.status);
    const qty = String(item.quantity).padStart(2, "0");

    return (
      <View style={styles.card}>
        {/* Top Row: icon + name/id + status badge */}
        <View style={styles.cardTop}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconText}>{getIcon(item.name)}</Text>
          </View>

          <View style={styles.cardMeta}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.orderId}>{formatOrderId(item.id)}</Text>
          </View>

          <View style={[styles.statusBadge, statusStyle.badge]}>
            <View style={[styles.statusDot, statusStyle.dot]} />
            <Text style={[styles.statusLabel, statusStyle.text]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Quantity + Amount */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoKey}>QUANTITY</Text>
            <Text style={styles.infoVal}>{qty} {item.quantity === 1 ? "Unit" : "Units"}</Text>
          </View>
          <View style={styles.infoColRight}>
            <Text style={styles.infoKey}>TOTAL AMOUNT</Text>
            <Text style={styles.infoValPrice}>₹{Number(item.total_price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
          </View>
        </View>

        {/* Date + Time */}
        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateIcon}>📅</Text>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateIcon}>🕐</Text>
            <Text style={styles.dateText}>{formatTime(item.created_at)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero Header */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Equipment Orders</Text>
        <Text style={styles.heroSub}>
          View all your safety equipment rental orders, status, and payment details.
        </Text>
      </View>

      {/* List */}
      <View style={styles.listWrap}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
              <Text style={styles.emptySub}>
                Rent safety equipment to see your orders here.
              </Text>
            </View>
          }
        />
      </View>

    </SafeAreaView>
  );
}

const INDIGO = "#4050C8";
const INDIGO_LIGHT = "#EEF2FF";

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#4050C8",
  },

  hero: {
    backgroundColor: "#4050C8",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroSub: {
    color: "#C7CFEF",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 21,
  },

  listWrap: {
    flex: 1,
    backgroundColor: "#F0F2FA",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#1a1a4a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: INDIGO_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 26,
  },
  cardMeta: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 22,
  },
  orderId: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "500",
  },

  // Status badges
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 2,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "700",
  },

  statusPending: { backgroundColor: "#FFF7E6" },
  dotPending: { backgroundColor: "#F59E0B" },
  statusTextPending: { color: "#B45309" },

  statusDelivered: { backgroundColor: "#E8FAF0" },
  dotDelivered: { backgroundColor: "#22C55E" },
  statusTextDelivered: { color: "#166534" },

  statusCancelled: { backgroundColor: "#FEF0F0" },
  dotCancelled: { backgroundColor: "#EF4444" },
  statusTextCancelled: { color: "#991B1B" },

  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  infoKey: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoVal: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  infoValPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: INDIGO,
  },

  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  dateText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 64,
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
