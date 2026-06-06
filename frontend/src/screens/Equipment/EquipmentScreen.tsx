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


const API_URL = "http://10.215.185.190:5000";


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
        <Text style={styles.loaderText}>
          Loading Equipment...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.title}>Safety Equipment Rental</Text>

      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>
          Safety Equipment Rentals
        </Text>

        <Text style={styles.heroSubtitle}>
          Rent helmets, safety kits, emergency tools,
          and protective equipment for your journey.
        </Text>
      </View>

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
              activeOpacity={0.9}
              style={styles.itemContainer}
              onPress={() =>
                navigation.navigate("EquipmentDetails", { item })
              }
            >
              
              <View style={styles.card}>
                 <View
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#4F46E5",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: "700",
                      }}
                    >
                      RENT
                    </Text>
                  </View>

                <View style={styles.imageContainer}>
                  <Image
                    source={{
                      uri: `${API_URL}/static/equipment/${item.image}`,
                    }}
                    style={styles.image}
                  />
                </View>

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text style={styles.price}>
                  ₹{item.price}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    item.status === "available"
                      ? styles.availableBadge
                      : styles.unavailableBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.status,
                      item.status === "available"
                        ? styles.available
                        : styles.unavailable,
                    ]}
                  >
                    {item.status === "available"
                      ? "✓ Available"
                      : "✕ Unavailable"}
                  </Text>
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

  heroCard: {
    backgroundColor: "#ae00e8",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },

  heroSubtitle: {
    color: "#E0E7FF",
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

  itemContainer: {
    width: CARD_SIZE,
    marginBottom: 18,
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 10,

    padding: 15,

    alignItems: "center",

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
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor: "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

  image: {
    width: 65,
    height: 65,
    resizeMode: "contain",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },

  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4F46E5",
    marginBottom: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  availableBadge: {
    backgroundColor: "#DCFCE7",
  },

  unavailableBadge: {
    backgroundColor: "#FEE2E2",
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
  },

  available: {
    color: "#15803D",
  },

  unavailable: {
    color: "#DC2626",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loaderText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
  },
});