import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 2 - 30;

const equipmentData = [
  {
    id: "1",
    name: "First Aid Box",
    image: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
  },
  {
    id: "2",
    name: "Baby Feeding Kit",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
  },
  {
    id: "3",
    name: "Helmet",
    image: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
  },
  {
    id: "4",
    name: "Life Jacket",
    image: "https://cdn-icons-png.flaticon.com/512/865/865969.png",
  },
  {
    id: "5",
    name: "Trekking Kit",
    image: "https://cdn-icons-png.flaticon.com/512/2965/2965567.png",
  },
  {
    id: "6",
    name: "Flashlight",
    image: "https://cdn-icons-png.flaticon.com/512/2913/2913462.png",
  },
];

export default function EquipmentScreen() {
  const navigation = useNavigation<any>(); // ✅ must be inside component
  const [search, setSearch] = useState("");

  const filteredData = equipmentData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Safety Equipment Rental</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search equipment..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {/* Grid */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() =>
              navigation.navigate("EquipmentDetails", { item })
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
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  itemContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    backgroundColor: "#ffffff",
    borderRadius: 18,
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
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});