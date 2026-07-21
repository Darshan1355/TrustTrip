import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

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
  onSecondary: "#ffffff",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

const typography = {
  headlineLg: { fontFamily: "Inter", fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.4 },
  headlineMd: { fontFamily: "Inter", fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.2 },
  bodyLg: { fontFamily: "Inter", fontSize: 18, fontWeight: "400" as const, lineHeight: 26 },
  bodyMd: { fontFamily: "Inter", fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  labelMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "600" as const },
  labelSm: { fontFamily: "Inter", fontSize: 12, fontWeight: "600" as const },
};

const spacing = { base: 4, xs: 8, sm: 16, md: 24, lg: 40, xl: 64, marginMobile: 20 };
const radius = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };

const ambientShadow = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.08,
  shadowRadius: 20,
  elevation: 4,
};

// Presentation-only lookup: maps each dashboard option to an icon + tint.
// Purely visual — does not alter the underlying options data or navigation logic.
const OPTION_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; tint: "primary" | "error" }> = {
  Language: { icon: "globe-outline", tint: "primary" },
  WomenSafety: { icon: "shield-checkmark-outline", tint: "primary" },
  Guide: { icon: "compass-outline", tint: "primary" },
  SOS: { icon: "alert-circle-outline", tint: "error" },
  Complaint: { icon: "document-text-outline", tint: "primary" },
  PriceCheck: { icon: "pricetag-outline", tint: "primary" },
  Crowd: { icon: "people-outline", tint: "primary" },
  Equipment: { icon: "briefcase-outline", tint: "primary" },
};

// Presentation-only captions layered over the `ads` images — does not change
// the ads array, the auto-scroll interval, or the scrollRef logic below.
const AD_CAPTIONS = [
  { badge: "20% OFF", badgeTint: "secondary" as const, title: "Coastal Escapes" },
  { badge: "Verified", badgeTint: "primary" as const, title: "Old Town Trails" },
  { badge: "New", badgeTint: "secondary" as const, title: "Mountain Retreats" },
];

const TABS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap; screen: string }[] = [
  { key: "Home", label: "Home", icon: "home", screen: "Home" },
  { key: "Chat", label: "Chat", icon: "chatbubbles-outline", screen: "ChatBot" },
  { key: "Dashboard", label: "Dashboard", icon: "grid-outline", screen: "Dashboard" },
  { key: "Profile", label: "Profile", icon: "person-outline", screen: "Profile" },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

  // --- Backend logic (unchanged) ------------------------------------------
  const ads = [
    "https://picsum.photos/400/200",
    "https://picsum.photos/401/200",
    "https://picsum.photos/402/200",
  ];

  const options = [
    {
      title: "Language Help",
      screen: "Language",
      img: "https://cdn-icons-png.flaticon.com/512/3898/3898082.png",
    },
    {
      title: "Women Safety",
      screen: "WomenSafety",
      img: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    },
    {
      title: "Local Guide",
      screen: "Guide",
      img: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
    },
    {
      title: "SOS Emergency",
      screen: "SOS",
      img: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
    },
    {
      title: "Complaints",
      screen: "Complaint",
      img: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
    },
    {
      title: "Price Check",
      screen: "PriceCheck",
      img: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png",
    },
    {
      title: "Crowd Status",
      screen: "Crowd",
      img: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    },
    {
      title: "Safety Equipments",
      screen: "Equipment",
      img: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
    },
  ];

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % ads.length;

      scrollRef.current?.scrollTo({
        x: index * width * 0.88,
        animated: true,
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  // --- End backend logic ---------------------------------------------------

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.appBar}>
        <Text style={styles.logo}>TrustTrip</Text>

        <View style={styles.appBarActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
              style={styles.profile}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* HERO */}
      <LinearGradient
        colors={[colors.primary, colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <Text style={styles.heroTitle}>Explore Safely 🌍</Text>
        <Text style={styles.heroSubtitle}>
          Your vigilant travel companion for secure journeys and verified experiences worldwide.
        </Text>
      </LinearGradient>

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* STATS — overlaps the hero/content seam */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsRow}
          contentContainerStyle={styles.statsRowContent}
        >
          <View style={styles.statPill}>
            <View style={[styles.statIconWrap, { backgroundColor: colors.secondaryContainer }]}>
              <Ionicons name="headset-outline" size={16} color={colors.onSecondaryContainer} />
            </View>
            <Text style={styles.statPillText}>24/7 Support</Text>
          </View>

          <View style={styles.statPill}>
            <View style={[styles.statIconWrap, { backgroundColor: colors.errorContainer }]}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
            </View>
            <Text style={styles.statPillText}>SOS Ready</Text>
          </View>

          <View style={styles.statPill}>
            <View style={[styles.statIconWrap, { backgroundColor: colors.surfaceContainerHigh }]}>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.primary} />
            </View>
            <Text style={styles.statPillText}>100% Verified</Text>
          </View>
        </ScrollView>

        {/* DASHBOARD */}
        <Text style={styles.sectionTitle}>Travel Dashboard</Text>

        <View style={styles.grid}>
          {options.map((item, index) => {
            const meta = OPTION_ICONS[item.screen] ?? { icon: "ellipse-outline", tint: "primary" as const };
            const isAlert = meta.tint === "error";

            return (
              <TouchableOpacity
                key={index}
                style={styles.gridItem}
                activeOpacity={0.7}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View
                  style={[
                    styles.gridIconWrap,
                    { backgroundColor: isAlert ? colors.errorContainer : colors.surfaceContainerHigh },
                  ]}
                >
                  <Ionicons name={meta.icon} size={22} color={isAlert ? colors.error : colors.primary} />
                </View>
                <Text style={styles.gridLabel} numberOfLines={2}>
                  {item.title.replace(" Help", "").replace(" Emergency", "").replace("s", "")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ADS SECTION */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.subHeading}>Special Offers</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.adContainer}
        >
          {ads.map((ad, index) => {
            const caption = AD_CAPTIONS[index % AD_CAPTIONS.length];
            const badgeBg = caption.badgeTint === "secondary" ? colors.secondary : colors.primary;

            return (
              <View key={index} style={styles.adCard}>
                <Image source={{ uri: ad }} style={styles.adImage} />
                <LinearGradient
                  colors={["transparent", "rgba(11,28,48,0.75)"]}
                  style={styles.adOverlay}
                />
                <View style={[styles.adBadge, { backgroundColor: badgeBg }]}>
                  <Text style={styles.adBadgeText}>{caption.badge}</Text>
                </View>
                <Text style={styles.adTitle}>{caption.title}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* SAFETY CHECK */}
        <View style={styles.safetyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.safetyTitle}>Safety Check</Text>
            <Text style={styles.safetySubtitle}>Scanning nearby safe zones...</Text>
          </View>
          <View style={styles.safetyStatus}>
            <View style={styles.safetyStatusDot} />
          </View>
        </View>

        <View style={{ height: spacing.xl + spacing.md }} />
      </ScrollView>

      {/* BOTTOM TAB BAR */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = tab.key === "Home";
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, active && styles.tabItemActive]}
              onPress={() => navigation.navigate(tab.screen)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={active ? colors.primary : colors.onSurfaceVariant}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // --- Header --------------------------------------------------------------
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.marginMobile,
    paddingTop: Platform.OS === "ios" ? 55 : 40,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
  },

  logo: {
    ...typography.headlineMd,
    color: colors.primary,
  },

  appBarActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },

  profile: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },

  // --- Hero ------------------------------------------------------------------
  heroCard: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius.xl + spacing.sm,
    borderBottomRightRadius: radius.xl + spacing.sm,
  },

  heroTitle: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },

  heroSubtitle: {
    ...typography.bodyMd,
    color: "#c7d5ff",
    marginTop: spacing.xs,
    maxWidth: "90%",
  },

  // --- Content shell (Clean Minimalist) --------------------------------------
  content: {
    flex: 1,
    marginTop: -radius.xl,
  },

  contentContainer: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
  },

  // --- Stats pills (overlap hero seam) ---------------------------------------
  statsRow: {
    marginBottom: spacing.md,
  },

  statsRowContent: {
    gap: spacing.xs,
    paddingRight: spacing.marginMobile,
  },

  statPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.xs,
    ...ambientShadow,
  },

  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },

  statPillText: {
    ...typography.labelMd,
    color: colors.onSurface,
  },

  // --- Sections ----------------------------------------------------------------
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },

  subHeading: {
    ...typography.headlineMd,
    fontSize: 18,
  },

  seeAll: {
    ...typography.labelMd,
    color: colors.primary,
  },

  // --- Dashboard grid ------------------------------------------------------------
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },

  gridIconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },

  gridLabel: {
    ...typography.labelSm,
    fontWeight: "500",
    color: colors.onSurfaceVariant,
    textAlign: "center",
  },

  // --- Offer cards ------------------------------------------------------------------
  adContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  adCard: {
    width: width * 0.62,
    height: 160,
    borderRadius: radius.lg,
    marginRight: spacing.xs,
    overflow: "hidden",
    backgroundColor: colors.surfaceContainer,
  },

  adImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },

  adOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },

  adBadge: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
  },

  adBadgeText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontSize: 11,
  },

  adTitle: {
    position: "absolute",
    left: spacing.sm,
    bottom: spacing.xs,
    ...typography.labelMd,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onPrimary,
  },

  // --- Safety check card ---------------------------------------------------------------
  safetyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.xl,
    padding: spacing.md,
  },

  safetyTitle: {
    ...typography.labelMd,
    fontSize: 16,
    fontWeight: "700",
    color: colors.onSurface,
  },

  safetySubtitle: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  safetyStatus: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    ...ambientShadow,
  },

  safetyStatusDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },

 

  // --- Bottom tab bar ---------------------------------------------------------------------
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surfaceContainerLowest,
    paddingTop: spacing.xs,
    paddingBottom: Platform.OS === "ios" ? spacing.md : spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.base,
  },

  tabItemActive: {
    backgroundColor: colors.surfaceContainerHigh,
    marginHorizontal: spacing.xs,
    borderRadius: radius.md,
  },

  tabLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  tabLabelActive: {
    color: colors.primary,
  },
});
