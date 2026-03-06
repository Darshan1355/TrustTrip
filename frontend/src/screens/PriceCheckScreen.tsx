import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const basePrices = [
  { id: "1", name: "Coconut Water", price: 30 },
  { id: "2", name: "Auto Fare (per km)", price: 15 },
  { id: "3", name: "Monument Ticket", price: 50 },
  { id: "4", name: "Water Bottle (1L)", price: 20 },
];

export default function PriceCheckScreen() {
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const getMultiplier = () => {
    switch (category) {
      case "Municipal":
        return 1;
      case "Tourist":
        return 1.5;
      case "Highway":
        return 1.3;
      case "Rural":
        return 0.8;
      default:
        return 1;
    }
  };

  const multiplier = getMultiplier();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Transparency</Text>

      {/* Location Input */}
      <TextInput
        placeholder="Enter Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      {/* Category Dropdown */}
      <View style={styles.dropdown}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => setCategory(value)}
        >
          <Picker.Item label="Select Area Category" value="" />
          <Picker.Item label="Municipal Corporation Area" value="Municipal" />
          <Picker.Item label="Tourist Place" value="Tourist" />
          <Picker.Item label="Highway / Transit Area" value="Highway" />
          <Picker.Item label="Rural / Other Area" value="Rural" />
        </Picker>
      </View>

      {/* Price List */}
      {category !== "" && (
        <FlatList
          data={basePrices}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const adjustedPrice = Math.round(item.price * multiplier);

            return (
              <View style={styles.card}>
                <Text style={styles.productName}>{item.name}</Text>

                <Text style={styles.priceText}>
                  Allowed Price: ₹{adjustedPrice}
                </Text>

                <Text style={styles.rangeText}>
                  Acceptable Range: ₹
                  {Math.round(adjustedPrice * 0.9)} - ₹
                  {Math.round(adjustedPrice * 1.1)}
                </Text>
              </View>
            );
          }}
        />
      )}
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
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 4,
  },

  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  priceText: {
    fontSize: 15,
    color: "#1e88e5",
    fontWeight: "600",
  },

  rangeText: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
});