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
    name: "Washroom Facility",
    image: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    available: true,
  },
  {
    id: "2",
    name: "Baby Feeding Room",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    available: true,
  },
  {
    id: "3",
    name: "Safe Waiting Area",
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    available: false,
  },
  {
    id: "4",
    name: "Safety Vehicle",
    image: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    available: true,
  },
  {
    id: "5",
    name: "Safety Assistant",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    available: false,
  },
];

export default function WomenSafetyScreen() {
  const navigation = useNavigation<any>();

  return (

    

    <View style={styles.container}>
      <Text style={styles.title}>Women Safety Facilities</Text>

       <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Women's Safety Dashboard
          </Text>

          <Text style={styles.infoText}>
            Check available facilities and safety services nearby
            to ensure a secure and comfortable travel experience.
          </Text>
       </View>

      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
         <TouchableOpacity
  style={styles.cardContainer}
  activeOpacity={0.9}
  onPress={() =>
    navigation.navigate("WomenSafetyDetail", { facility: item })
  }
>
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
    </View>

    <View style={styles.detailsContainer}>
      <Text style={styles.name}>{item.name}</Text>

      <View
        style={
          item.available
            ? styles.availableBadge
            : styles.unavailableBadge
        }
      >
        <Text
          style={
            item.available
              ? styles.availableText
              : styles.unavailableText
          }
        >
          {item.available ? "✓ Available" : "✕ Not Available"}
        </Text>
      </View>
    </View>
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
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  cardContainer: {
    marginBottom: 18,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",
    borderRadius: 24,

    padding: 18,

    borderWidth: 1,
    borderColor: "#EEF2FF",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 8,
  },

  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F4F7FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  detailsContainer: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },

  status: {
    fontSize: 14,
    fontWeight: "700",
  },

  availableBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  unavailableBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  availableText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 13,
  },

  unavailableText: {
    color: "#DC2626",
    fontWeight: "700",
    fontSize: 13,
  },

  infoCard: {
  backgroundColor: "#4F46E5",
  borderRadius: 24,
  padding: 20,
  marginBottom: 20,
},

infoTitle: {
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 8,
},

infoText: {
  color: "#E0E7FF",
  fontSize: 14,
  lineHeight: 22,
},
});