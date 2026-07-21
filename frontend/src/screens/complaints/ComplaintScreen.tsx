import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import api from "../../config/api";

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

// Presentation-only: maps each fixed category string to an icon. Values
// match `categories` below exactly — does not affect selection/submit logic.
const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Overpricing: "pricetag-outline",
  "Women Safety": "female-outline",
  "No Washroom": "body-outline",
  "Language Problem": "language-outline",
  "Overcrowded Area": "people-outline",
  "Police Issue": "shield-outline",
  "Dirty Area": "trash-outline",
  "Fake Products": "alert-circle-outline",
  Other: "ellipsis-horizontal-outline",
};

const categories = [
  "Overpricing",
  "Women Safety",
  "No Washroom",
  "Language Problem",
  "Overcrowded Area",
  "Police Issue",
  "Dirty Area",
  "Fake Products",
  "Other",
];

export default function ComplaintScreen() {
  const navigation = useNavigation<any>();

  // --- Backend logic (unchanged) --------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState("");
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState<any>(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      Alert.alert("Please select a complaint category.");
      return;
    }

    try {
      // GET LOGGED IN USER
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const parsedUser = JSON.parse(user);
      const username = parsedUser.username;

      const response = await api.post("/complaint", {
        username: username,
        category: selectedCategory,
        description: complaint,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      });

      const data = response.data;

      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Success", data.message);

        setComplaint("");
        setSelectedCategory("");
        setLocation(null);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Could not submit complaint");
    }
  };

  const getSuggestion = () => {
    if (selectedCategory === "Overpricing")
      return "Tip: Check verified shop list in Local Guide section.";
    if (selectedCategory === "Women Safety")
      return "Tip: Use SOS button for immediate help.";
    if (selectedCategory === "No Washroom")
      return "Tip: Check nearby washrooms in Facilities section.";
    if (selectedCategory === "Language Problem")
      return "Tip: Use in-app Translator feature.";
    if (selectedCategory === "Overcrowded Area")
      return "Tip: Take a Guidence of local guides.";
    if (selectedCategory === "Police Issue")
      return "Tip: Use SOS button for immediate help.";
    if (selectedCategory === "Dirty Area")
      return "Tip: Ask local guides for recommendations.";
    if (selectedCategory === "Fake Products")
      return "Tip: Check verified shop list in Local Guide section.";
    else if (selectedCategory === "Other")
      return "Tip: Provide as much detail as possible in the description.";
    return "";
  };
  // --- End backend logic -----------------------------------------------------

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.screen}>

      {/* HERO - Fixed */}
      <LinearGradient
        colors={[colors.primary, colors.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerCard}
      >
        <Text style={styles.headerTitle}>Submit Report</Text>

        <Text style={styles.headerSubtitle}>
          Your feedback helps us keep the community safe and improve travel
          experiences for everyone.
        </Text>

        <Ionicons
          name="shield-outline"
          size={90}
          color="rgba(255,255,255,0.08)"
          style={styles.heroWatermark}
        />
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.dragHandle} />

        {/* Category */}
        <Text style={styles.sectionTitle}>
          Issue Category
        </Text>

        <FlatList
          data={categories}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          renderItem={({ item }) => {
            const selected = selectedCategory === item;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryCard,
                  selected && styles.selectedCard,
                ]}
                onPress={() => setSelectedCategory(item)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={
                    CATEGORY_ICONS[item] ??
                    "ellipse-outline"
                  }
                  size={22}
                  color={
                    selected
                      ? colors.onPrimary
                      : colors.primary
                  }
                  style={{ marginBottom: spacing.xs }}
                />

                <Text
                  style={[
                    styles.categoryText,
                    selected &&
                      styles.categoryTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
            }}
          />

          {/* Smart Suggestion */}
          {selectedCategory !== "" && <Text style={styles.suggestion}>{getSuggestion()}</Text>}

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>

          <TextInput
            placeholder="Describe the issue in detail. What happened? Where exactly did it occur?"
            placeholderTextColor={colors.onSurfaceVariant}
            style={styles.input}
            multiline
            value={complaint}
            onChangeText={setComplaint}
          />

          {/* Location Button */}
          <TouchableOpacity style={styles.locationBtn} onPress={getLocation} activeOpacity={0.85}>
            <Ionicons
              name={location ? "checkmark-circle-outline" : "locate-outline"}
              size={18}
              color={colors.primary}
            />
            <Text style={styles.locationBtnText}>
              {location ? "Location Added ✓" : "Add My Location"}
            </Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.9}>
            <Text style={styles.submitBtnText}>Submit Complaint</Text>
          </TouchableOpacity>

          {/* NEED IMMEDIATE HELP */}
          <View style={styles.sosCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sosTitle}>NEED IMMEDIATE HELP?</Text>
              <Text style={styles.sosText}>
                If you are in danger, please use the Emergency SOS button immediately.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.sosButton}
              onPress={() => navigation.navigate("SOS")}
              activeOpacity={0.85}
            >
              <Text style={styles.sosButtonText}>SOS</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: spacing.lg }} />
        </ScrollView>

     
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // --- Content --------------------------------------------------------------
  container: {
    paddingBottom: spacing.md,
  },

  // --- Hero ------------------------------------------------------------------
  headerCard: {
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.xl + spacing.sm,
    borderBottomRightRadius: radius.xl + spacing.sm,
    overflow: "hidden",
  },

  headerTitle: {
    ...typography.headlineLg,
    color: colors.onPrimary,
  },

  headerSubtitle: {
    ...typography.bodyMd,
    color: "#c7d5ff",
    marginTop: spacing.xs,
    maxWidth: "85%",
  },

  heroWatermark: {
    position: "absolute",
    right: -10,
    bottom: -10,
  },

  dragHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    marginTop: -radius.xl - spacing.xs,
    marginBottom: spacing.md,
  },

  // --- Sections ----------------------------------------------------------------
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 19,
    color: colors.onSurface,
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.sm,
  },

  // --- Category grid ---------------------------------------------------------------
  categoryCard: {
    width: "46%",
    marginHorizontal: "2%",
    backgroundColor: colors.surfaceContainerLow,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },

  selectedCard: {
    backgroundColor: colors.primary,
  },

  categoryText: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.onSurface,
    textAlign: "center",
  },

  categoryTextSelected: {
    color: colors.onPrimary,
  },

  // --- Suggestion -----------------------------------------------------------------
  suggestion: {
    backgroundColor: colors.secondaryContainer,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginHorizontal: spacing.marginMobile,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: colors.onSecondaryContainer,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "500",
  },

  // --- Description input ---------------------------------------------------------
  input: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.lg,
    padding: spacing.sm,
    height: 130,
    textAlignVertical: "top",
    fontSize: 15,
    color: colors.onSurface,
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.sm,
  },

  // --- Location button ---------------------------------------------------------------
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.sm,
  },

  locationBtnText: {
    ...typography.labelMd,
    fontSize: 15,
    color: colors.primary,
  },

  // --- Submit button ---------------------------------------------------------------
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm + spacing.base,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.marginMobile,
    marginBottom: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  submitBtnText: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onPrimary,
  },

  // --- SOS card ------------------------------------------------------------------
  sosCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.errorContainer,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginHorizontal: spacing.marginMobile,
  },

  sosTitle: {
    ...typography.labelSm,
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.base,
  },

  sosText: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onErrorContainer,
  },

  sosButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },

  sosButtonText: {
    ...typography.labelSm,
    fontSize: 12,
    color: colors.onError,
  },

});
