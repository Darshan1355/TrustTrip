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
            style={styles.cardContainer}
            onPress={() =>
              navigation.navigate("SOSDetail", { emergency: item })
            }
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  searchBar: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  cardContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  card: {
    width: "100%",
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  image: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },

  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});