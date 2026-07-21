import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
  onSecondary: "#ffffff",
  secondaryContainer: "#6cf8bb",
  onSecondaryContainer: "#00714d",
  error: "#ba1a1a",
  onError: "#ffffff",
  errorContainer: "#ffdad6",
};

const typography = {
  headlineLg: { fontFamily: "Inter", fontSize: 24, fontWeight: "700" as const, letterSpacing: -0.2 },
  headlineMd: { fontFamily: "Inter", fontSize: 20, fontWeight: "700" as const, letterSpacing: -0.1 },
  bodyMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  labelMd: { fontFamily: "Inter", fontSize: 14, fontWeight: "600" as const },
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
  { key: "Dashboard", label: "Dashboard", icon: "grid-outline", screen: "Dashboard" },
  { key: "Profile", label: "Profile", icon: "person", screen: "Profile" },
];

export default function ProfileScreen({ logoutUser, navigation }: any) {
  // --- Backend logic (unchanged) --------------------------------------------
  const [isEditing, setIsEditing] = useState(false);
  const [complaintCount, setComplaintCount] = useState(0);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [mob, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [emergency_contact, setEmergency] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  // ---------------- FETCH PROFILE ----------------
  const fetchProfile = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const parsedUser = JSON.parse(user);
      const uname = parsedUser.username;

      setUsername(uname);

      const response = await api.get(`/profile/${uname}`);

      const data = response.data;

      setName(data.name || "");
      setMobile(data.mob || "");
      setAddress(data.address || "");
      setNationality(data.nationality || "");
      setEmergency(data.emergency_contact || "");

      const complaintRes = await api.get(`/user-complaints/${uname}`);

      const complaintData = complaintRes.data;
      setComplaintCount(complaintData.length);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Unable to load profile");
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    try {
      const response = await api.put(`/profile/${username}`, {
        name,
        mob,
        address,
        nationality,
        emergency_contact,
      });

      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Success", "Profile Updated");
        setIsEditing(false);
      } else {
        Alert.alert("Error", "Update failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    logoutUser();
  };
  // --- End backend logic -----------------------------------------------------

  const avatarUri = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const fields: { label: string; value: string; onChange: (v: string) => void; keyboardType?: "numeric" }[] = [
    { label: "Full Name", value: name, onChange: setName },
    { label: "Nationality", value: nationality, onChange: setNationality },
    { label: "Mobile Number", value: mob, onChange: setMobile, keyboardType: "numeric" },
    { label: "Emergency Contact", value: emergency_contact, onChange: setEmergency, keyboardType: "numeric" },
    { label: "Residential Address", value: address, onChange: setAddress },
  ];

  return (
    <View style={styles.screen}>


      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <LinearGradient
          colors={[colors.primary, colors.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.avatarRing}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          </View>

          <Text style={styles.username}>{name || username}</Text>

          <View style={styles.verifiedRow}>
            <Ionicons name="shield-checkmark" size={14} color={colors.secondaryContainer} />
            <Text style={styles.verifiedText}>Verified Global Citizen</Text>
          </View>
        </LinearGradient>

        {/* STATS — overlaps the hero/content seam */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{complaintCount}</Text>
            <Text style={styles.statLabel}>COMPLAINTS</Text>
          </View>

          <View style={[styles.statCard, styles.statCardHighlight]}>
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={colors.onSecondaryContainer}
              style={{ marginBottom: 2 }}
            />
            <Text style={[styles.statNumber, styles.statNumberHighlight]}>100%</Text>
            <Text style={[styles.statLabel, styles.statLabelHighlight]}>VERIFIED</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.activeDotRow}>
              <View style={styles.activeDot} />
              <Text style={styles.statNumber}>Active</Text>
            </View>
            <Text style={styles.statLabel}>STATUS</Text>
          </View>
        </View>

        {/* PERSONAL INFO CARD */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Personal Details</Text>

            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
              <Ionicons
                name={isEditing ? "close-outline" : "pencil-outline"}
                size={14}
                color={colors.primary}
              />
              <Text style={styles.editText}>{isEditing ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          {fields.map((field, index) => (
            <View key={field.label} style={[styles.fieldRow, index === 0 && { marginTop: spacing.sm }]}>
              <Text style={styles.label}>{field.label}</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={field.value}
                  onChangeText={field.onChange}
                  keyboardType={field.keyboardType}
                  placeholderTextColor={colors.onSurfaceVariant}
                />
              ) : (
                <Text style={styles.value}>{field.value || "—"}</Text>
              )}
            </View>
          ))}

          {isEditing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* DASHBOARD CARDS */}
        <TouchableOpacity
          style={[styles.dashboardCard, styles.dashboardCardPrimary]}
          onPress={() => navigation.navigate("MyComplaints")}
          activeOpacity={0.85}
        >
          <Ionicons name="shield" size={24} color={colors.onPrimary} style={{ marginBottom: spacing.xs }} />
          <Text style={styles.dashboardTitlePrimary}>My Complaints</Text>
          <Text style={styles.dashboardSubPrimary}>Track and manage your submitted safety reports.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardCard}
          onPress={() => navigation.navigate("MyOrders")}
          activeOpacity={0.85}
        >
          <Ionicons name="bag-handle-outline" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
          <Text style={styles.dashboardTitle}>My Orders</Text>
          <Text style={styles.dashboardSub}>Access details for your purchased travel security packs.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dashboardCard}
          onPress={() => navigation.navigate("Guide")}
          activeOpacity={0.85}
        >
          <Ionicons name="book-outline" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
          <Text style={styles.dashboardTitle}>Guides</Text>
          <Text style={styles.dashboardSub}>Learn how to stay safe in various travel scenarios.</Text>
        </TouchableOpacity>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={18} color={colors.onError} />
          <Text style={styles.logoutText}>Logout from TrustTrip</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Version 2.4.0 · Secured by GlobalVault™</Text>

        <View style={{ height: spacing.lg }} />
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  container: {
    paddingBottom: spacing.lg,
  },


  // --- Hero ------------------------------------------------------------------
  heroCard: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.marginMobile,
    borderBottomLeftRadius: radius.xl + spacing.sm,
    borderBottomRightRadius: radius.xl + spacing.sm,
  },

  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: radius.full,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.surfaceContainerLowest,
  },

  username: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    marginTop: spacing.base,
  },

  verifiedText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: "#c7d5ff",
  },

  // --- Stats pills (overlap hero seam) ---------------------------------------
  statsRow: {
    flexDirection: "row",
    marginHorizontal: spacing.marginMobile,
    marginTop: -radius.xl,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: "center",
    ...ambientShadow,
  },

  statCardHighlight: {
    backgroundColor: colors.secondaryContainer,
    shadowColor: colors.secondary,
  },

  statNumber: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.primary,
  },

  statNumberHighlight: {
    color: colors.onSecondaryContainer,
  },

  statLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  statLabelHighlight: {
    color: colors.onSecondaryContainer,
  },

  activeDotRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
  },

  // --- Personal info card ------------------------------------------------------
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.marginMobile,
    padding: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
    ...ambientShadow,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  editText: {
    ...typography.labelMd,
    color: colors.primary,
  },

  fieldRow: {
    marginTop: spacing.sm,
  },

  label: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.base,
  },

  value: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.onSurface,
  },

  input: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: 15,
    color: colors.onSurface,
  },

  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: radius.DEFAULT,
    alignItems: "center",
    marginTop: spacing.md,
  },

  saveText: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.onPrimary,
  },

  // --- Dashboard cards -----------------------------------------------------------
  dashboardCard: {
    backgroundColor: colors.surfaceContainerLowest,
    marginHorizontal: spacing.marginMobile,
    padding: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.sm,
    ...ambientShadow,
  },

  dashboardCardPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
  },

  dashboardTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onSurface,
  },

  dashboardSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  dashboardTitlePrimary: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onPrimary,
  },

  dashboardSubPrimary: {
    ...typography.bodyMd,
    color: "#c7d5ff",
    marginTop: 2,
  },

  // --- Logout ------------------------------------------------------------------
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.error,
    marginHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    borderRadius: radius.DEFAULT,
    marginTop: spacing.xs,
  },

  logoutText: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.onError,
    letterSpacing: 0.3,
  },

  footerText: {
    ...typography.labelSm,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    marginTop: spacing.sm,
    letterSpacing: 0.2,
  },

});
