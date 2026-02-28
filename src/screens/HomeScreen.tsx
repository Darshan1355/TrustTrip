import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import OptionCard from "../components/OptionCard";
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
    { title: "Language Help", screen: "Language", img: "https://cdn-icons-png.flaticon.com/512/3898/3898082.png" },
    { title: "Women Safety", screen: "WomenSafety", img: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png" },
    { title: "Local Guide", screen: "Guide", img: "https://cdn-icons-png.flaticon.com/512/201/201623.png" },
    { title: "SOS Emergency", screen: "SOS", img: "https://cdn-icons-png.flaticon.com/512/565/565547.png" },
    { title: "Complaints", screen: "Complaint", img: "https://cdn-icons-png.flaticon.com/512/942/942748.png" },
    { title: "Price Check", screen: "PriceCheck", img: "https://cdn-icons-png.flaticon.com/512/1170/1170576.png" },
    { title: "Crowd Status", screen: "Crowd", img: "https://cdn-icons-png.flaticon.com/512/747/747376.png" },
    { title: "Safety Equipments", screen: "Equipment", img: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png" },
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % ads.length;
      scrollRef.current?.scrollTo({ x: index * width * 0.9, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#1e88e5", "#42a5f5"]} style={styles.container}>
      <View style={styles.appBar}>
        <Text style={styles.logo}>TrustTrip</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
            style={styles.profile}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.adContainer}
      >
        {ads.map((ad, index) => (
          <Image key={index} source={{ uri: ad }} style={styles.adImage} />
        ))}
      </ScrollView>

      <ScrollView style={styles.options}>
        {options.map((item, index) => (
          <OptionCard
            key={index}
            title={item.title}
            image={item.img}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  profile: { width: 40, height: 40, borderRadius: 20 },
  welcome: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 20,
    marginVertical: 10,
  },
  adContainer: { marginVertical: 10 },
  adImage: {
    width: width * 0.9,
    height: 150,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  options: {
    backgroundColor: "#f4f6f8",
    marginTop: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
  },
});