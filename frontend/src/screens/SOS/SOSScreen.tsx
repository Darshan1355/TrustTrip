import React, { ComponentProps, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons"; 
type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type Emergency = {
  id: string;
  name: string;
  icon: MaterialIconName;
  number: string;
  bgColor: string;
};


const emergencies: Emergency[] = [
  {
    id: "1",
    name: "Forest Emergency",
    icon: "forest",
    number: "1926",
    bgColor: "#F0FDF4",
  },
  {
    id: "2",
    name: "Police",
    icon: "local-police",
    number: "100",
    bgColor: "#EFF6FF",
  },
  {
    id: "3",
    name: "Ambulance",
    icon: "medical-services",
    number: "108",
    bgColor: "#FFF7ED",
  },
  {
    id: "4",
    name: "Fire Department",
    icon: "local-fire-department",
    number: "101",
    bgColor: "#FEF2F2",
  },
  {
    id: "5",
    name: "Other Services",
    icon: "support-agent",
    number: "112",
    bgColor: "#F5F3FF",
  },
];

export default function SOSScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

const filteredData = emergencies.filter((item) =>
  item.name.toLowerCase().includes(search.toLowerCase())
);

  const renderItem = ({ item }: { item: typeof emergencies[0] }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.cardContainer}
      onPress={() => navigation.navigate("SOSDetail", { emergency: item })}
    >
      <View style={styles.card}>
        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: item.bgColor }]}>
          <MaterialIcons name={item.icon} size={34} color="#1E3A8A"  />
        </View>

        {/* Details */}
        <View style={styles.cardDetails}>
          <Text style={styles.cardName}>
            {item.name}
          </Text>
          <Text style={styles.cardNumberLabel}>
            Emergency Number:{" "}
            <Text style={styles.cardNumber}>{item.number}</Text>
          </Text>
        </View>

        {/* Call Button */}
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Linking.openURL(`tel:${item.number}`)}
        >
          {/* Phone SVG-style icon using text */}
          <Text style={styles.callIcon}>📞</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* ── HEADER ── */}
      <View style={styles.header}>

        {/* Hero text */}
        <Text style={styles.heroTitle}>Emergency SOS</Text>
        <Text style={styles.heroSubtitle}>
          Instant access to critical help and{"\n"}local emergency services worldwide.
        </Text>

        {/* Broadcast SOS Button */}
        <TouchableOpacity style={styles.broadcastButton} activeOpacity={0.85}>
          <View>
            <Text style={styles.broadcastTitle}>Broadcast SOS</Text>
            <Text style={styles.broadcastSub}>ALERTS ALL LOCAL CONTACTS</Text>
          </View>
          <View style={styles.broadcastIconWrap}>
            <Text style={styles.broadcastIcon}>📍</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── WHITE SHEET ── */}
      <View style={styles.sheet}>
        {/* Search */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search emergency type..."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* List */}
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.safeZoneCard}>
              <View style={styles.safeZoneHeader}>
                <Text style={styles.safeZoneShield}>🛡️</Text>
                <Text style={styles.safeZoneLabel}>SAFE ZONE VERIFIED</Text>
              </View>
              <Text style={styles.safeZoneLocation}>Central London, UK</Text>
              <Text style={styles.safeZoneDesc}>
                High density of police patrols. Nearest hospital is 0.4 miles away.
              </Text>
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
    backgroundColor: "#1E40AF",
  },



  /* ── HEADER ── */
  header: {
    backgroundColor: "#1E40AF",
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 21,
    marginBottom: 22,
  },

  /* ── BROADCAST ── */
  broadcastButton: {
    backgroundColor: "#B91C1C",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  broadcastTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 3,
  },
  broadcastSub: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1.2,
  },
  broadcastIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  broadcastIcon: { fontSize: 24 },

  /* ── WHITE SHEET ── */
  sheet: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
    paddingTop: 22,
    paddingHorizontal: 18,
  },

  /* ── SEARCH ── */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: { fontSize: 16, marginRight: 10, color: "#9CA3AF" },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
  },

  /* ── LIST ── */
  listContent: {
    paddingBottom: 100,
  },

  /* ── CARD ── */
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardImage: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardNumberLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  cardNumber: {
    color: "#DC2626",
    fontWeight: "700",
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
  },
  callIcon: { fontSize: 18 },

  /* ── SAFE ZONE ── */
  safeZoneCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  safeZoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  safeZoneShield: { fontSize: 16 },
  safeZoneLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 1,
  },
  safeZoneLocation: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 4,
  },
  safeZoneDesc: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
  },

  /* ── FAB ── */
  fabSOS: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    transform: [{ rotate: "45deg" }],
  },


 
});
