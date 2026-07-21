import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../config/api";

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
  secondary: "#006c49",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  error: "#ba1a1a",
  onError: "#ffffff",
};

const typography = {
  headlineLg: { fontFamily: "Inter", fontSize: 26, fontWeight: "700" as const, letterSpacing: -0.3 },
  headlineMd: { fontFamily: "Inter", fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.1 },
  bodyMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "400" as const, lineHeight: 21 },
  labelMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "700" as const },
  labelSm: { fontFamily: "Inter", fontSize: 11, fontWeight: "700" as const, letterSpacing: 0.6 },
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

// Presentation-only: chip options mirror the original Picker's items exactly
// (same values, same labels) — just rendered as selectable chips instead of
// a native dropdown. Selecting one still calls setCategory(value) below.
const CATEGORY_OPTIONS: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { label: "Municipal", value: "Municipal", icon: "business-outline" },
  { label: "Tourist", value: "Tourist", icon: "airplane-outline" },
  { label: "Highway", value: "Highway", icon: "car-outline" },
  { label: "Rural", value: "Rural", icon: "leaf-outline" },
];

const iconForProduct = (name: string): keyof typeof Ionicons.glyphMap => {
  const n = name.toLowerCase();
  if (n.includes("water")) return "water-outline";
  if (n.includes("coffee") || n.includes("tea")) return "cafe-outline";
  if (n.includes("taxi") || n.includes("cab")) return "car-outline";
  if (n.includes("metro") || n.includes("bus") || n.includes("transit")) return "subway-outline";
  if (n.includes("food") || n.includes("meal")) return "restaurant-outline";
  return "pricetag-outline";
};

export default function PriceCheckScreen() {
  const navigation = useNavigation<any>();

  // --- Backend logic (unchanged) --------------------------------------------
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Tourist"); // DEFAULT
  const [prices, setPrices] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await api.get("/prices");
      const data = res.data;

      setPrices(data);
    } catch (error) {
      console.log("Price fetch error:", error);
    }
  };

  // ---------------- CATEGORY MULTIPLIER ----------------
  const getMultiplier = () => {
    switch (category) {
      case "Municipal":
        return 1;

      case "Tourist":
        return 1.5;

      case "Highway":
        return 1.3;

      case "Rural":
        return 0.8;

      default:
        return 1;
    }
  };

  const multiplier = getMultiplier();

  // ---------------- SEARCH FILTER ----------------
  const filteredPrices = prices.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  // --- End backend logic -----------------------------------------------------

 return (
  <View style={styles.screen}>

    {/* HERO */}
    <LinearGradient
      colors={[colors.primary, colors.primaryContainer]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroCard}
    >
      <View style={styles.protocolChip}>
        <Ionicons
          name="shield-checkmark"
          size={12}
          color={colors.secondaryContainer}
        />
        <Text style={styles.protocolChipText}>
          FAIR TRADE PROTOCOL
        </Text>
      </View>

      <Text style={styles.title}>Price Transparency</Text>

      <Text style={styles.heroSubtitle}>
        Check fair prices across different regions to avoid being
        overcharged. Our data is updated daily by community reports.
      </Text>
    </LinearGradient>

    {/* SEARCH */}
    <View style={styles.searchWrap}>
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={18}
          color={colors.onSurfaceVariant}
        />

        <TextInput
          placeholder="Search products (e.g. Water, Coffee, Taxi)"
          placeholderTextColor={colors.onSurfaceVariant}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>
    </View>

    {/* CATEGORY CHIPS */}
    <View style={styles.chipRow}>
      {CATEGORY_OPTIONS.map((opt) => {
        const active = category === opt.value;

        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              active && styles.chipActive,
            ]}
            onPress={() => setCategory(opt.value)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={opt.icon}
              size={14}
              color={
                active
                  ? colors.onPrimary
                  : colors.primary
              }
            />

            <Text
              style={[
                styles.chipText,
                active && styles.chipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {/* PRODUCT LIST */}
    <FlatList
      data={filteredPrices}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const adjustedPrice = Math.round(
          item.base_price * multiplier
        );

        const lowRange = Math.round(adjustedPrice * 0.9);
        const highRange = Math.round(adjustedPrice * 1.1);

        return (
          <View style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.productIconWrap}>
                <Ionicons
                  name={iconForProduct(item.name)}
                  size={20}
                  color={colors.primary}
                />
              </View>

              <View style={styles.fairPriceBadge}>
                <Text style={styles.fairPriceText}>
                  {item.priceType ?? "Fair Price"}
                </Text>
              </View>
            </View>

            <Text style={styles.productName}>
              {item.name}
            </Text>

            {!!item.category && (
              <Text style={styles.productCategory}>
                {item.category}
              </Text>
            )}

            <Text style={styles.priceText}>
              ${adjustedPrice}
              <Text style={styles.priceSuffix}>
                {" "}Allowed Price
              </Text>
            </Text>

            <View style={styles.rangeRow}>
              <Text style={styles.rangeLabel}>
                Acceptable Range
              </Text>

              <Text style={styles.rangeValue}>
                ${lowRange} - ${highRange}
              </Text>
            </View>
          </View>
        );
      }}
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

  protocolChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.base,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.base,
    marginBottom: spacing.sm,
  },

  protocolChipText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.secondaryContainer,
  },

  title: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },

  heroSubtitle: {
    ...typography.bodyMd,
    color: "#c7d5ff",
    marginTop: spacing.xs,
  },

  // --- Search bar (overlaps hero seam) ----------------------------------------
  searchWrap: {
    marginHorizontal: spacing.marginMobile,
    marginTop: -radius.xl,
    marginBottom: spacing.sm,
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

  // --- Category chips ------------------------------------------------------------
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.md,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },

  chipActive: {
    backgroundColor: colors.primary,
  },

  chipText: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.primary,
  },

  chipTextActive: {
    color: colors.onPrimary,
  },

  // --- Product cards -----------------------------------------------------------------
  listContent: {
    paddingBottom: spacing.lg,
  },

  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.sm,
    ...ambientShadow,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },

  productIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },

  fairPriceBadge: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  fairPriceText: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSecondaryContainer,
  },

  productName: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onSurface,
  },

  productCategory: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  priceText: {
    ...typography.headlineMd,
    fontSize: 22,
    color: colors.secondary,
    marginTop: spacing.sm,
  },

  priceSuffix: {
    ...typography.bodyMd,
    fontSize: 13,
    fontWeight: "400",
    color: colors.onSurfaceVariant,
  },

  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
  },

  rangeLabel: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },

  rangeValue: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.onSurface,
  },


});
