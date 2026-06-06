import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const emergencies = [
  {
    id: "1",
    name: "Forest Emergency",
    image: "https://cdn-icons-png.flaticon.com/512/427/427735.png",
    number: "1926",
  },
  {
    id: "2",
    name: "Police Emergency",
    image: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
    number: "100",
  },
  {
    id: "3",
    name: "Ambulance",
    image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    number: "108",
  },
  {
    id: "4",
    name: "Fire Brigade",
    image: "https://cdn-icons-png.flaticon.com/512/482/482281.png",
    number: "101",
  },
  {
    id: "5",
    name: "Other Emergency",
    image: "https://cdn-icons-png.flaticon.com/512/565/565547.png",
    number: "112",
  },
];

export default function SOSScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState("");

  const filteredData = emergencies.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency SOS</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search emergency type..."
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
       renderItem={({ item }) => (
  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.cardContainer}
    onPress={() =>
      navigation.navigate("SOSDetail", { emergency: item })
    }
  >
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.numberLabel}>
          Emergency Number
        </Text>

        <Text style={styles.emergencyNumber}>
          {item.number}
        </Text>
      </View>

      <View style={styles.arrowContainer}>
        <Text style={styles.arrowText}>›</Text>
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
    marginBottom: 20,
    letterSpacing: 0.5,
  },

  emergencyBanner: {
    backgroundColor: "#DC2626",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  emergencyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  emergencySubtitle: {
    color: "#FEE2E2",
    fontSize: 14,
    lineHeight: 22,
  },

  searchBar: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    paddingHorizontal: 18,
    paddingVertical: 14,

    fontSize: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,

    marginBottom: 22,
  },

  cardContainer: {
    marginBottom: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    padding: 18,
    borderRadius: 24,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 6,
  },

  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,

    backgroundColor: "#FEF2F2",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 18,
  },

  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
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

  numberLabel: {
    color: "#6B7280",
    fontSize: 13,
  },

  emergencyNumber: {
    color: "#DC2626",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },

  arrowContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,

    backgroundColor: "#F3F4F6",

    justifyContent: "center",
    alignItems: "center",
  },

  arrowText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6B7280",
  },
});