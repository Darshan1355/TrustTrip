import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import api from "../config/api";

type Complaint = { id: number; category: string; status?: string; created_at: string };
type GuideShort = { g_id: number; name: string; rating: number; status: string };
type Order = { id: number; name: string; total_price: number; status: string };

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

      // Parallel requests
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

  const renderComplaint = ({ item }: { item: Complaint }) => (
    <View style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.category}</Text>
      <Text style={styles.itemMeta}>{item.status || "Pending"}</Text>
    </View>
  );

  const renderGuide = ({ item }: { item: GuideShort }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("Guide")}
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemMeta}>⭐ {item.rating.toFixed(1)} • {item.status}</Text>
    </TouchableOpacity>
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => navigation.navigate("MyOrders")}
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemMeta}>₹{Number(item.total_price).toLocaleString()} • {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={loadAll} style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("MyComplaints")}>
          <Text style={styles.summaryNum}>{complaints.length}</Text>
          <Text style={styles.summaryLabel}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("Guide")}>
          <Text style={styles.summaryNum}>{bookedGuides.length}</Text>
          <Text style={styles.summaryLabel}>Booked Guides</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.summaryCard} onPress={() => navigation.navigate("MyOrders")}>
          <Text style={styles.summaryNum}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Orders</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MyComplaints")}> 
            <Text style={styles.link}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={complaints.slice(0, 3)}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderComplaint}
          ListEmptyComponent={<Text style={styles.empty}>No reports</Text>}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Booked Guides</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Guide")}> 
            <Text style={styles.link}>Manage</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={bookedGuides.slice(0, 3)}
          keyExtractor={(i) => String(i.g_id)}
          renderItem={renderGuide}
          ListEmptyComponent={<Text style={styles.empty}>No booked guides</Text>}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate("MyOrders")}>
            <Text style={styles.link}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={orders.slice(0, 3)}
          keyExtractor={(i) => String(i.id)}
          renderItem={renderOrder}
          ListEmptyComponent={<Text style={styles.empty}>No recent orders</Text>}
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7FBFF", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "800", color: "#0B1C30" },
  refreshBtn: { padding: 8 },
  refreshText: { color: "#2563EB" },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
  summaryCard: { flex: 1, backgroundColor: "#fff", padding: 12, marginHorizontal: 6, borderRadius: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.04, elevation: 2 },
  summaryNum: { fontSize: 22, fontWeight: "800" },
  summaryLabel: { fontSize: 12, color: "#6B7280", marginTop: 6 },
  section: { marginBottom: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  link: { color: "#2563EB" },
  listItem: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { fontWeight: "700" },
  itemMeta: { color: "#6B7280", fontSize: 12 },
  empty: { color: "#9CA3AF", padding: 12 },
});
