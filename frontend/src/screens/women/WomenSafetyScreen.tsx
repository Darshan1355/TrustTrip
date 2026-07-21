import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const facilities = [
  {
    id: "1",
    name: "Women Washroom",
    image: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    available: true,
    statusLabel: "AVAILABLE",
  },
  {
    id: "2",
    name: "Baby Feeding",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    available: true,
    statusLabel: "AVAILABLE",
  },
  {
    id: "3",
    name: "Safe Waiting",
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    available: false,
    statusLabel: "FULL",
  },
  {
    id: "4",
    name: "Women Patrol",
    image: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    available: true,
    statusLabel: "ACTIVE",
  },
  {
    id: "5",
    name: "Emergency Hub",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    available: true,
    statusLabel: "OPEN 24/7",
  },
  {
    id: "6",
    name: "Sanitary Dispenser",
    image: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    available: true,
    statusLabel: "STOCKED",
  },
  {
    id: "7",
    name: "Safe Taxi Stand",
    image: "https://cdn-icons-png.flaticon.com/512/3097/3097183.png",
    available: true,
    statusLabel: "5 MINS WAIT",
  },
  {
    id: "8",
    name: "High Lighting",
    image: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
    available: true,
    statusLabel: "VERIFIED",
  },
  {
    id: "9",
    name: "Women Helpdesk",
    image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
    available: true,
    statusLabel: "AVAILABLE",
  },
  {
    id: "10",
    name: "Verified Stay",
    image: "https://cdn-icons-png.flaticon.com/512/483/483947.png",
    available: true,
    statusLabel: "SAFE LIST",
  },
  {
    id: "11",
    name: "Escort Service",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    available: false,
    statusLabel: "BUSY",
  },
  {
    id: "12",
    name: "CCTV camera Monitoring",
    image: "https://cdn-icons-png.flaticon.com/512/2910/2910762.png",
    available: true,
    statusLabel: "ACTIVE",
  },
];

export default function WomenSafetyScreen() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: typeof facilities[0] }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigation.navigate("WomenSafetyDetail", { facility: item })}
    >
      <View style={styles.iconCircle}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <Text style={styles.cardName}>{item.name}</Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.available ? "#16A34A" : "#DC2626" },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: item.available ? "#16A34A" : "#DC2626" },
          ]}
        >
          {item.statusLabel}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F0FF" />

      {/* ── PINK HERO HEADER ── */}
      <View style={styles.heroHeader}>
        <Text style={styles.heroTitle}>Women Safety</Text>
        <Text style={styles.heroSubtitle}>
          Explore nearby women-friendly facilities, verified services, and safe travel routes.
        </Text>
      </View>

      {/* ── WHITE SHEET ── */}
      <View style={styles.sheet}>
        {/* Pull handle */}
        <View style={styles.pullHandle} />

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Verified Facilities</Text>
          <View style={styles.nearbyBadge}>
            <Text style={styles.nearbyText}>12 Nearby</Text>
          </View>
        </View>

        <FlatList
          data={facilities}
          numColumns={2}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={renderItem}
          ListFooterComponent={
            <View style={styles.safeRouteCard}>
              <Text style={styles.safeRouteTitle}>Safe Travel Route</Text>
              <Text style={styles.safeRouteDesc}>
                Your current path is 98% safe based on verified community reports and active police
                patrolling.
              </Text>
              {/* Map placeholder */}
              <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>🗺️</Text>
              </View>
            </View>
          }
        />
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9A8D4",
  },

  /* HERO */
  heroHeader: {
    backgroundColor: "#EC4899",
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 22,
  },

  /* WHITE SHEET */
  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  pullHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  /* SECTION HEADER */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  nearbyBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  nearbyText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#059669",
  },

  /* GRID */
  row: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingBottom: 100,
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 18,
    alignItems: "flex-start",
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FDF2F8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: "#DB2777",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  /* SAFE ROUTE CARD */
  safeRouteCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    padding: 18,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  safeRouteTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E40AF",
    marginBottom: 8,
  },
  safeRouteDesc: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  mapPlaceholder: {
    height: 90,
    backgroundColor: "#BFDBFE",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: { fontSize: 36 },

  /* SOS FAB */
  fabSOS: {
    position: "absolute",
    right: 20,
    bottom: 84,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 12,
  },
  fabSOSText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.5,
  },

  
});
