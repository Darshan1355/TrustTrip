import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const scrollRef = useRef<ScrollView>(null);

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

  return (
    <LinearGradient
      colors={["#1E88E5", "#42A5F5"]}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.appBar}>
        <Text style={styles.logo}>TrustTrip</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.profile}
          />
        </TouchableOpacity>
      </View>

      {/* HERO */}
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>
          Explore Safely 🌍
        </Text>

        <Text style={styles.heroSubtitle}>
          Trusted travel support, guides,
          emergency help and safety services.
        </Text>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* DASHBOARD */}
        <Text style={styles.sectionTitle}>
          Travel Dashboard
        </Text>

        <View style={styles.grid}>
          {options.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionCard}
              onPress={() =>
                navigation.navigate(item.screen)
              }
            >
              <Image
                source={{ uri: item.img }}
                style={styles.optionImage}
              />

              <Text style={styles.optionTitle}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ADS SECTION */}
        <Text style={styles.subHeading}>
          Travel Updates
        </Text>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.adContainer}
        >
          {ads.map((ad, index) => (
            <Image
              key={index}
              source={{ uri: ad }}
              style={styles.adImage}
            />
          ))}
        </ScrollView>

        {/* STATS */}
        <View style={styles.quickStatsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              24/7
            </Text>

            <Text style={styles.statLabel}>
              Support
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              SOS
            </Text>

            <Text style={styles.statLabel}>
              Ready
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              100%
            </Text>

            <Text style={styles.statLabel}>
              Verified
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CHATBOT */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() =>
          navigation.navigate("ChatBot")
        }
      >
        <Text style={styles.chatText}>
          💬
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
  },

  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  logo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
  },

  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },

  heroCard: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 15,
  },

  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },

  heroSubtitle: {
    color: "#E3F2FD",
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },

  content: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  optionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },

  optionImage: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },

  optionTitle: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },

  subHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
    marginBottom: 12,
  },

  adContainer: {
    marginBottom: 20,
  },

  adImage: {
    width: width * 0.85,
    height: 120,
    borderRadius: 18,
    marginRight: 12,
  },

  quickStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  statCard: {
    width: "31%",
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
    elevation: 4,
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#4F46E5",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
  },

  chatButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },

  chatText: {
    fontSize: 28,
    color: "#fff",
  },
});