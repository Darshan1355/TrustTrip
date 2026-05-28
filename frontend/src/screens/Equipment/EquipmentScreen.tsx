import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 2 - 30;

const API_URL = "https://trusttrip-nng1.onrender.com";

type Equipment = {
  id: number;
  name: string;
  price: number;
  image: string;
  status: string;
};

export default function EquipmentScreen() {
  const navigation = useNavigation<any>();

  const [search, setSearch] = useState("");
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH DATA ----------------
  const fetchEquipment = async () => {
    try {
      const res = await fetch(`${API_URL}/equipment`);
      const data = await res.json();

      setEquipmentData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // ---------------- SEARCH FILTER ----------------
  const filteredData = equipmentData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1e88e5" />
        <Text>Loading Equipment...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Safety Equipment Rental</Text>

      {/* SEARCH BAR */}
      <TextInput
        placeholder="Search equipment..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {/* GRID */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
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
              <Image
                source={{
                  uri: `${API_URL}/static/equipment/${item.image}`,
                }}
                style={styles.image}
              />
            </View>

            <Text style={styles.name}>{item.name}</Text>

            <Text style={styles.price}>₹{item.price}</Text>

            <Text
              style={[
                styles.status,
                item.status === "available"
                  ? styles.available
                  : styles.unavailable,
              ]}
            >
              {item.status}
            </Text>
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
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  name: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e88e5",
  },

  status: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },

  available: {
    color: "green",
  },

  unavailable: {
    color: "red",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});