import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  TextInput,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StarRating from "react-native-star-rating-widget";
import { LinearGradient } from "expo-linear-gradient";
import api from "../config/api";

type Guide = {
  g_id: number;
  name: string;
  languages: string;
  status: string;
  rating: number;
  booked_by_user?: boolean;
};

const guideImages = [
  "https://randomuser.me/api/portraits/men/11.jpg",
  "https://randomuser.me/api/portraits/women/21.jpg",
  "https://randomuser.me/api/portraits/men/31.jpg",
  "https://randomuser.me/api/portraits/women/41.jpg",
  "https://randomuser.me/api/portraits/men/51.jpg",
  "https://randomuser.me/api/portraits/women/61.jpg",
  "https://randomuser.me/api/portraits/men/71.jpg",
  "https://randomuser.me/api/portraits/women/81.jpg",
];

// ── Palette (from screenshot) ──────────────────────────────────────────────
const C = {
  heroDark: "#1A2F7A",   // top of gradient
  heroMid:  "#2E50B8",   // mid
  heroLight:"#3B6ADE",   // bottom of gradient
  white:    "#FFFFFF",
  pageBg:   "#F5F6FA",
  cardBg:   "#FFFFFF",
  cardBorder:"#EFEFEF",
  searchBg: "#EDEEF3",
  searchBorder:"#DDDEE8",
  filterBg: "#E8EAEF",
  filterIcon:"#4A5568",
  navy:     "#1A2B6D",   // Book Guide button
  navyText: "#FFFFFF",
  greenBadge:"#E6F9EF",
  greenText: "#22A861",
  busyBadge: "#FFE9E9",
  busyText:  "#E53535",
  bookedBadge:"#FEF9C3",
  bookedText: "#A16207",
  starAmber: "#F5A623",
  starBg:    "#FFF8EC",
  starText:  "#C17D0A",
  verified:  "#22A861",
  // Rating card
  rateBg:    "#EBF0FF",
  rateBorder:"#3DBE8B",
  skipBg:    "#DCE8FF",
  skipText:  "#1E3A8A",
  rateGreen: "#1A6B4A",
  shieldGreen:"#3DBE8B",
  // Globe icon colour
  globe:     "#5A6A8A",
};

export default function GuideScreen() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [bookedGuideIds, setBookedGuideIds] = useState<Set<number>>(new Set());

  useEffect(() => { fetchGuides(); }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredGuides(guides);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredGuides(
        guides.filter(
          (g) =>
            g.name.toLowerCase().includes(lower) ||
            g.languages.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, guides]);

  // ── Backend calls (unchanged) ─────────────────────────────────────────────

  const fetchGuides = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      const username = userData ? JSON.parse(userData).username : null;
      const res = await api.get("/guides", {
        params: username ? { username } : {},
      });

      const guideData = Array.isArray(res.data) ? res.data : [];
      setGuides(guideData);

      const bookedIds = new Set<number>();
      guideData.forEach((guide: Guide) => {
        if (guide.booked_by_user) {
          bookedIds.add(guide.g_id);
        }
      });
      setBookedGuideIds(bookedIds);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not load guides. Please try again.");
    }
  };

  const getUsername = async (): Promise<string | null> => {
    const userData = await AsyncStorage.getItem("user");
    if (!userData) { Alert.alert("Error", "User not logged in"); return null; }
    return JSON.parse(userData).username;
  };

  const selectGuide = async (guideId: number) => {
    const username = await getUsername();
    if (!username) return;
    try {
      await api.post("/select-guide", { guide_id: guideId, username });
      setBookedGuideIds((prev) => new Set(prev).add(guideId));
      setSelectedGuide(guideId);
      await fetchGuides();
      Alert.alert("Guide Booked ✅", "Your guide has been confirmed.");
    } catch (error) {
      Alert.alert("Error", "Could not book guide. Please try again.");
      console.log(error);
    }
  };

  const cancelGuide = async (guideId: number) => {
    const username = await getUsername();
    if (!username) return;
    try {
      await api.post("/cancel-booking", { guide_id: guideId, username });
      setBookedGuideIds((prev) => {
        const copy = new Set(prev);
        copy.delete(guideId);
        return copy;
      });
      await fetchGuides();
      Alert.alert("Booking Cancelled", "Your guide booking has been cancelled.");
    } catch (error) {
      Alert.alert("Error", "Could not cancel booking. Please try again.");
      console.log(error);
    }
  };

  const submitRating = async (guideId: number) => {
    if (rating === 0) { Alert.alert("Select a rating", "Please choose at least 1 star."); return; }
    const username = await getUsername();
    if (!username) return;
    try {
      await api.post("/rate-guide", { guide_id: guideId, username, rating });
      Alert.alert("Thanks! ⭐", "Your rating has been submitted.");
      setRating(0);
      setSelectedGuide(null);
      fetchGuides();
    } catch (error) {
      Alert.alert("Error", "Could not submit rating. Please try again.");
      console.log(error);
    }
  };

  const skipRating = () => { setRating(0); setSelectedGuide(null); };

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getEffectiveStatus = (guide: Guide) =>
    bookedGuideIds.has(guide.g_id) || guide.booked_by_user ? "Booked" : guide.status;

  const statusStyle = (status: string) => {
    if (status === "Available") return { bg: C.greenBadge, text: C.greenText };
    if (status === "Busy")      return { bg: C.busyBadge,  text: C.busyText  };
    return                             { bg: C.bookedBadge, text: C.bookedText };
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderCard = (item: Guide) => {
    const effStatus = getEffectiveStatus(item);
    const sc = statusStyle(effStatus);
    return (
      <View style={s.card} key={item.g_id}>
        {/* Avatar */}
        <View style={s.avatarWrap}>
          <Image
            source={{ uri: guideImages[item.g_id % guideImages.length] }}
            style={s.avatar}
          />
          <View style={s.verifiedDot}>
            <Text style={s.verifiedTick}>✓</Text>
          </View>
        </View>

        {/* Name */}
        <Text style={s.guideName} numberOfLines={1}>{item.name}</Text>

        {/* Languages row */}
        <View style={s.langRow}>
          {/* Globe SVG-like circle */}
          <View style={s.globeIcon}>
            <Text style={s.globeText}>🌐</Text>
          </View>
          <Text style={s.langText} numberOfLines={1}>{item.languages}</Text>
        </View>

        {/* Status + Rating */}
        <View style={s.badgeRow}>
          <View style={[s.statusPill, { backgroundColor: sc.bg }]}>
            <Text style={[s.statusText, { color: sc.text }]}>{effStatus}</Text>
          </View>
          <View style={s.ratingPill}>
            <Text style={s.ratingStarIcon}>★</Text>
            <Text style={s.ratingVal}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Book / Cancel button */}
        {effStatus === "Booked" ? (
          <TouchableOpacity
            style={[s.bookBtn, s.bookBtnBooked]}
            onPress={() => cancelGuide(item.g_id)}
            activeOpacity={0.85}
          >
            <Text style={s.bookBtnText}>Cancel Booking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={s.bookBtn}
            onPress={() => selectGuide(item.g_id)}
            activeOpacity={0.85}
          >
            <Text style={s.bookBtnText}>Book Guide</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRatingCard = (item: Guide) => (
    <View style={s.rateCard} key={`rate-${item.g_id}`}>
      {/* Header row */}
      <View style={s.rateHeader}>
        <Image
          source={{ uri: guideImages[item.g_id % guideImages.length] }}
          style={s.rateAvatar}
        />
        <View style={s.rateHeaderText}>
          <Text style={s.rateTitle}>Rate your experience</Text>
          <Text style={s.rateSub}>
            How was your tour with {item.name.split(" ")[0]}?
          </Text>
        </View>
        {/* Shield icon */}
        <View style={s.shieldWrap}>
          <Text style={s.shieldIcon}>🛡️</Text>
        </View>
      </View>

      {/* Stars */}
      <View style={s.starsWrap}>
        <StarRating
          rating={rating}
          onChange={setRating}
          starSize={34}
          color={C.starAmber}
          emptyColor="#D1D5DB"
        />
      </View>

      {/* Actions */}
      <View style={s.rateActions}>
        <TouchableOpacity style={s.skipBtn} onPress={skipRating} activeOpacity={0.8}>
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.rateBtn} onPress={() => submitRating(item.g_id)} activeOpacity={0.85}>
          <Text style={s.rateBtnText}>Rate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Build rows of 2 so rating card can be injected between rows
  const rows: Guide[][] = [];
  for (let i = 0; i < filteredGuides.length; i += 2) {
    rows.push(filteredGuides.slice(i, i + 2));
  }
  const selectedGuideObj = filteredGuides.find((g) => g.g_id === selectedGuide);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.heroDark} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* ── Hero gradient ─────────────────────────────────────────────── */}
        <LinearGradient
          colors={[C.heroDark, C.heroMid, C.heroLight]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={s.hero}
        >
          <Text style={s.heroTitle}>Tourist Guides</Text>
          <Text style={s.heroSub}>
            Connect with verified local guides and{"\n"}explore destinations with confidence.
          </Text>
        </LinearGradient>

        {/* ── White sheet ───────────────────────────────────────────────── */}
        <View style={s.sheet}>
          {/* Drag handle */}
          <View style={s.handle} />

          {/* Search row */}
          <View style={s.searchRow}>
            <View style={s.searchBox}>
              <Text style={s.searchMagnify}>🔍</Text>
              <TextInput
                style={s.searchInput}
                placeholder="Search guides..."
                placeholderTextColor="#9CA3AF"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity style={s.filterBtn} activeOpacity={0.75}>
              <Text style={s.filterIconText}>⚙</Text>
            </TouchableOpacity>
          </View>

          {/* Guide grid */}
          <View style={s.grid}>
            {rows.map((row, idx) => {
              const rowHasSelected =
                selectedGuideObj &&
                row.some((g) => g.g_id === selectedGuideObj.g_id);
              return (
                <View key={idx}>
                  <View style={s.gridRow}>{row.map(renderCard)}</View>
                  {rowHasSelected && renderRatingCard(selectedGuideObj!)}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const CARD_W = "48.5%";

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.heroDark },

  // ── Hero ──
  hero: {
    paddingTop: 56,
    paddingBottom: 42,
    paddingHorizontal: 22,
  },
  heroTitle: {
    color: C.white,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSub: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14.5,
    lineHeight: 22,
  },

  // ── White sheet ──
  sheet: {
    backgroundColor: C.pageBg,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    minHeight: 600,
    paddingBottom: 40,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D4DF",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },

  // ── Search ──
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.searchBg,
    borderWidth: 1,
    borderColor: C.searchBorder,
    borderRadius: 14,
    paddingHorizontal: 13,
    height: 48,
  },
  searchMagnify: { fontSize: 15, marginRight: 8, color: "#8A93A8" },
  searchInput: { flex: 1, fontSize: 14.5, color: "#1A2040" },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: C.filterBg,
    borderWidth: 1,
    borderColor: C.searchBorder,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  filterIconText: { fontSize: 20, color: C.filterIcon },

  // ── Grid ──
  grid: { paddingHorizontal: 14 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  // ── Card ──
  card: {
    backgroundColor: C.cardBg,
    width: CARD_W,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.cardBorder,
    padding: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  // Avatar
  avatarWrap: { position: "relative", marginBottom: 11 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  verifiedDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.verified,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  verifiedTick: { color: C.white, fontSize: 11, fontWeight: "800" },

  // Name
  guideName: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: -0.2,
  },

  // Languages
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 4,
  },
  globeIcon: { width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  globeText: { fontSize: 13, color: C.globe },
  langText: { fontSize: 12.5, color: "#6B7280" },

  // Status + rating row
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 13,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statusPill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.starBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 3,
  },
  ratingStarIcon: { color: C.starAmber, fontSize: 13 },
  ratingVal: { color: C.starText, fontSize: 12.5, fontWeight: "700" },

  // Book button
  bookBtn: {
    backgroundColor: C.navy,
    width: "100%",
    paddingVertical: 11,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  bookBtnBooked: { backgroundColor: "#6B7280", shadowColor: "#6B7280" },
  bookBtnText: { color: C.white, fontWeight: "700", fontSize: 14 },

  // ── Rating card ──
  rateCard: {
    backgroundColor: C.rateBg,
    borderWidth: 1.5,
    borderColor: C.rateBorder,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  rateHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  rateAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  rateHeaderText: { flex: 1 },
  rateTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  rateSub: { fontSize: 13, color: "#6B7280" },
  shieldWrap: { width: 30, alignItems: "center" },
  shieldIcon: { fontSize: 20, color: C.shieldGreen },

  starsWrap: {
    alignItems: "center",
    marginBottom: 18,
  },

  rateActions: {
    flexDirection: "row",
    gap: 10,
  },
  skipBtn: {
    flex: 1,
    backgroundColor: C.skipBg,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
  },
  skipText: { color: C.skipText, fontWeight: "700", fontSize: 14 },
  rateBtn: {
    flex: 2,
    backgroundColor: C.rateGreen,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: C.rateGreen,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  rateBtnText: { color: C.white, fontWeight: "700", fontSize: 14 },
});