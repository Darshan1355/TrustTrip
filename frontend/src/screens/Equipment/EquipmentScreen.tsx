import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import api from "../../config/api";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 2 - 30;

// ---------------------------------------------------------------------------
// TrustTrip design tokens (from DESIGN.md)
// ---------------------------------------------------------------------------
const colors = {
  surface: "#f8f9ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#eff4ff",
  surfaceContainer: "#e5eeff",
  surfaceContainerHigh: "#dce9ff",
  onSurface: "#0b1c30",
  onSurfaceVariant: "#444651",
  outlineVariant: "#c5c5d3",
  primary: "#00236f",
  onPrimary: "#ffffff",
  primaryContainer: "#1e3a8a",
  surfaceTint: "#4059aa",
  secondary: "#006c49",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

const typography = {
  headlineLg: { fontFamily: "Inter", fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  headlineMd: { fontFamily: "Inter", fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.1 },
  bodyMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "400" as const, lineHeight: 21 },
  labelMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "700" as const },
  labelSm: { fontFamily: "Inter", fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.4 },
};

const spacing = { base: 4, xs: 8, sm: 16, md: 24, lg: 40, marginMobile: 20 };
const radius = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };

const ambientShadow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 4,
};

const TABS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; screen: string }[] = [
  { key: "Home", label: "Home", icon: "home-outline", screen: "Home" },
  { key: "Explore", label: "Explore", icon: "compass-outline", screen: "Guide" },
  { key: "Reports", label: "Reports", icon: "shield-outline", screen: "MyComplaints" },
  { key: "Profile", label: "Profile", icon: "person-outline", screen: "Profile" },
];

// Presentation-only: original flaticon PNGs kept below (untouched, still valid
// backend/reference data) — the redesign renders a duotone vector icon instead,
// picked by keyword-matching the equipment name. Purely visual, no data change.
const equipmentImages = [
  "https://cdn-icons-png.flaticon.com/512/3062/3062634.png", // Helmet
  "https://cdn-icons-png.flaticon.com/512/2965/2965567.png", // First Aid Kit
  "https://cdn-icons-png.flaticon.com/512/1048/1048941.png", // Torch
  "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Backpack
  "https://cdn-icons-png.flaticon.com/512/3659/3659898.png", // Life Jacket
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Medical Kit
  "https://cdn-icons-png.flaticon.com/512/4149/4149675.png", // Whistle
  "https://cdn-icons-png.flaticon.com/512/942/942748.png", // Emergency Kit
  "https://cdn-icons-png.flaticon.com/512/1048/1048941.png", // Flashlight

];

const iconForEquipment = (name: string): keyof typeof Ionicons.glyphMap => {
  const n = name.toLowerCase();
  if (n.includes("sos") || n.includes("helmet")) return "shield-outline";
  if (n.includes("sat") || n.includes("link") || n.includes("wifi") || n.includes("router")) return "wifi-outline";
  if (n.includes("aid") || n.includes("medical") || n.includes("kit")) return "medkit-outline";
  if (n.includes("night") || n.includes("torch") || n.includes("light")) return "flashlight-outline";
  if (n.includes("solar") || n.includes("battery") || n.includes("pack")) return "battery-charging-outline";
  if (n.includes("motion") || n.includes("sensor") || n.includes("running")) return "walk-outline";
  if (n.includes("jacket") || n.includes("life")) return "body-outline";
  if (n.includes("whistle")) return "megaphone-outline";
  if (n.includes("backpack") || n.includes("bag")) return "bag-outline";
  if (n.includes("rope") || n.includes("cord")) return "git-branch-outline";
  if (n.includes("gloves") || n.includes("mitts")) return "hand-left-outline";
  if (n.includes("goggles") || n.includes("glasses")) return "eye-outline";
  if (n.includes("boots") || n.includes("shoes")) return "walk-outline";
  if (n.includes("tent") || n.includes("shelter")) return "home-outline";
  if (n.includes("water") || n.includes("bottle")) return "water-outline";
  if (n.includes("fire") || n.includes("extinguisher")) return "flame-outline";
  if (n.includes("compass") || n.includes("navigation")) return "navigate-outline";
  if (n.includes("thermometer")) return "thermometer-outline";
  if (n.includes("repellent")) return "bug-outline";
  if (n.includes("reflective") || n.includes("arm band")) return "color-filter-outline";
  if (n.includes("raincoat") || n.includes("poncho")) return "rainy-outline";
  if (n.includes("power bank") || n.includes("solar charger") || n.includes("portable charger")) return "battery-charging-outline";
  if (n.includes("alarm") || n.includes("siren") || n.includes("strobe")) return "alert-outline";
  if(n.includes("spray") || n.includes("pepper") || n.includes("mace")) return "color-palette-outline";
  if (n.includes("gps") || n.includes("tracker")) return "locate-outline";
  if (n.includes("self defense") || n.includes("stick") || n.includes("baton")) return "shield-outline";

  return "cube-outline";
};

type Equipment = {
  id: number;
  name: string;
  price: number;
  status: string;
};

export default function EquipmentScreen() {
  const navigation = useNavigation<any>();

  // --- Backend logic (unchanged) --------------------------------------------
  const [search, setSearch] = useState("");
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  const fetchEquipment = async () => {
    try {
      const res = await api.get("/equipment");
      const data = res.data;

      setEquipmentData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // ---------------- SEARCH FILTER ----------------
  const filteredData = equipmentData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  // --- End backend logic -----------------------------------------------------

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Loading Equipment...</Text>
      </View>
    );
  }

return (
  <View style={styles.screen}>

    {/* HERO */}
    <LinearGradient
      colors={[colors.primary, colors.surfaceTint]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.6 }}
      style={styles.heroCard}
    >
      <Text style={styles.heroTitle}>Safety Equipment</Text>
      <Text style={styles.heroSubtitle}>
        Premium gear for your secure travels. Rent and track your protection
        essentials.
      </Text>
    </LinearGradient>

    {/* SEARCH BAR */}
    <View style={styles.searchWrap}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={18}
          color={colors.onSurfaceVariant}
        />

        <TextInput
          placeholder="Search safety gear..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>
    </View>

    {/* EQUIPMENT LIST */}
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-between",
        paddingHorizontal: spacing.marginMobile,
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate("EquipmentDetails", { item })
          }
        >
          <View style={styles.card}>
            <View style={styles.rentBadge}>
              <Text style={styles.rentBadgeText}>RENT</Text>
            </View>

            <View style={styles.imageContainer}>
              <Ionicons
                name={iconForEquipment(item.name)}
                size={34}
                color={colors.primary}
              />
            </View>

            <Text style={styles.name} numberOfLines={1}>
              {item.name}
            </Text>

            <Text style={styles.price}>
              ${item.price}
              <Text style={styles.priceSuffix}>/day</Text>
            </Text>

            <View
              style={[
                styles.statusBadge,
                item.status === "available"
                  ? styles.availableBadge
                  : styles.unavailableBadge,
              ]}
            >
              <Text
                style={[
                  styles.status,
                  item.status === "available"
                    ? styles.available
                    : styles.unavailable,
                ]}
              >
                {item.status === "available"
                  ? "Available"
                  : "Unavailable"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />

  </View>
);
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  
  // --- Hero ------------------------------------------------------------------
  heroCard: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.xl + spacing.sm,
    borderBottomRightRadius: radius.xl + spacing.sm,
  },

  heroTitle: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },

  heroSubtitle: {
    ...typography.bodyMd,
    color: "#dce9ff",
    marginTop: spacing.xs,
  },

  // --- Search bar (overlaps hero seam) ----------------------------------------
  searchWrap: {
    marginHorizontal: spacing.marginMobile,
    marginTop: -radius.xl,
    marginBottom: spacing.md,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...ambientShadow,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.onSurface,
  },

  // --- List / grid --------------------------------------------------------------
  listContent: {
    paddingBottom: spacing.lg,
  },

  itemContainer: {
    width: CARD_SIZE,
    marginHorizontal: spacing.marginMobile > 0 ? 0 : 0,
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.sm,
    alignItems: "center",
    ...ambientShadow,
  },

  rentBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  rentBadgeText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onPrimary,
  },

  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  name: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: spacing.base,
  },

  price: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.primary,
    marginBottom: spacing.xs,
  },

  priceSuffix: {
    ...typography.bodyMd,
    fontSize: 13,
    fontWeight: "400",
    color: colors.onSurfaceVariant,
  },

  statusBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  availableBadge: {
    backgroundColor: colors.secondaryContainer,
  },

  unavailableBadge: {
    backgroundColor: colors.errorContainer,
  },

  status: {
    ...typography.labelSm,
    fontSize: 11,
    letterSpacing: 0,
  },

  available: {
    color: colors.onSecondaryContainer,
  },

  unavailable: {
    color: colors.onErrorContainer,
  },

  // --- Loading state ---------------------------------------------------------------
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.surface,
  },

  loaderText: {
    ...typography.bodyMd,
    marginTop: spacing.sm,
    color: colors.onSurfaceVariant,
  },


});
