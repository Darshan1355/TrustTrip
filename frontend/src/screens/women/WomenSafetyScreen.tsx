import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const facilities = [
  {
    id: "1",
    name: "Women Washroom",
    image: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    available: true,
  },
  {
    id: "2",
    name: "Baby Feeding",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    available: true,
  },
  {
    id: "3",
    name: "Safe Waiting",
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    available: true,
  },
  {
    id: "4",
    name: "Women Patrol",
    image: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    available: true,
  },
  {
    id: "5",
    name: "Women Help Desk",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    available: true,
  },
  {
    id: "6",
    name: "Safe Route",
    image: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    available: true,
  },
  {
    id: "7",
    name: "Verified Taxi",
    image: "https://cdn-icons-png.flaticon.com/512/3097/3097183.png",
    available: false,
  },
  {
    id: "8",
    name: "Emergency Call",
    image: "https://cdn-icons-png.flaticon.com/512/483/483947.png",
    available: true,
  },
  {
    id: "9",
    name: "Nearby CCTV",
    image: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
    available: true,
  },
  {
    id: "10",
    name: "Well Lit Area",
    image: "https://cdn-icons-png.flaticon.com/512/2933/2933245.png",
    available: true,
  },
  {
    id: "11",
    name: "Women Volunteers",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    available: false,
  },
  {
    id: "12",
    name: "Panic Button",
    image: "https://cdn-icons-png.flaticon.com/512/1828/1828843.png",
    available: true,
  },
];

export default function WomenSafetyScreen() {

  const navigation = useNavigation<any>();

  return (

    <View style={styles.container}>

      {/* Header */}

      <View style={styles.headerCard}>

        <Text style={styles.headerTitle}>
          👩 Women Safety
        </Text>

        <Text style={styles.headerText}>
          Explore nearby women-friendly facilities,
          verified services, emergency support,
          safe travel routes and much more.
        </Text>

      </View>

      <FlatList
        data={facilities}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={() =>
              navigation.navigate(
                "WomenSafetyDetail",
                { facility: item }
              )
            }
          >

            <View style={styles.imageCircle}>

              <Image
                source={{ uri: item.image }}
                style={styles.image}
              />

            </View>

            <Text style={styles.name}>
              {item.name}
            </Text>

            <View
              style={[
                styles.badge,
                {
                  backgroundColor: item.available
                    ? "#DCFCE7"
                    : "#FEE2E2",
                },
              ]}
            >

              <Text
                style={{
                  color: item.available
                    ? "#16A34A"
                    : "#DC2626",
                  fontWeight: "700",
                  fontSize: 12,
                }}
              >

                {item.available
                  ? "✓ Available"
                  : "✕ Unavailable"}

              </Text>

            </View>

          </TouchableOpacity>

        )}
      />

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#F6F8FC",

    paddingHorizontal: 18,

    paddingTop: 20,

  },

  headerCard: {

    backgroundColor: "#E91E63",

    borderRadius: 25,

    padding: 22,

    marginBottom: 22,

    elevation: 8,

  },

  headerTitle: {

    color: "#fff",

    fontSize: 28,

    fontWeight: "800",

    marginBottom: 10,

  },

  headerText: {

    color: "#FCE4EC",

    fontSize: 15,

    lineHeight: 24,

  },

  card: {

    backgroundColor: "#FFFFFF",

    width: "48%",

    borderRadius: 22,

    alignItems: "center",

    paddingVertical: 22,

    marginBottom: 18,

    elevation: 6,

    shadowColor: "#000",

    shadowOpacity: 0.08,

    shadowRadius: 8,

    shadowOffset: {

      width: 0,

      height: 4,

    },

  },

  imageCircle: {

    width: 80,

    height: 80,

    borderRadius: 40,

    backgroundColor: "#FFF0F5",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 15,

  },

  image: {

    width: 48,

    height: 48,

    resizeMode: "contain",

  },

  name: {

    textAlign: "center",

    fontWeight: "700",

    fontSize: 15,

    color: "#333",

    marginHorizontal: 10,

    minHeight: 42,

  },

  badge: {

    marginTop: 14,

    paddingHorizontal: 12,

    paddingVertical: 6,

    borderRadius: 30,

  },

});