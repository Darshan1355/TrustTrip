import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import * as Location from "expo-location";

const categories = [
  "Overpricing",
  "Women Safety",
  "No Washroom",
  "Language Problem",
  "Overcrowded Area",
  "Police Issue",
  "Dirty Area",
  "Fake Products",
  "Other",
];

export default function ComplaintScreen() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState<any>(null);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      Alert.alert("Please select a complaint category.");
      return;
    }

    Alert.alert(
      "Complaint Submitted",
      `Category: ${selectedCategory}
Description: ${complaint || "No additional details"}
Location: ${
        location
          ? `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`
          : "Not Shared"
      }`
    );

    // Reset
    setComplaint("");
    setSelectedCategory("");
  };

  const getSuggestion = () => {
    if (selectedCategory === "Overpricing")
      return "Tip: Check verified shop list in Local Guide section.";
    if (selectedCategory === "Women Safety")
      return "Tip: Use SOS button for immediate help.";
    if (selectedCategory === "No Washroom")
      return "Tip: Check nearby washrooms in Facilities section.";
    if (selectedCategory === "Language Problem")
      return "Tip: Use in-app Translator feature.";
    return "";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Issue</Text>

      {/* Category Grid */}
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ justifyContent: "space-between" ,borderColor:"grey",borderWidth:1,marginBottom:10}}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              selectedCategory === item && styles.selectedCard,
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Smart Suggestion */}
      {selectedCategory !== "" && (
        <Text style={styles.suggestion}>{getSuggestion()}</Text>
      )}

      {/* Description */}
      <TextInput
        placeholder="Add more details (optional)..."
        style={styles.input}
        multiline
        value={complaint}
        onChangeText={setComplaint}
      />

      {/* Location Button */}
      <TouchableOpacity style={styles.locationBtn} onPress={getLocation}>
        <Text style={{ color: "#fff" }}>
          {location ? "Location Added ✓" : "Add My Location"}
        </Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Submit Complaint
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  categoryCard: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    width: "48%",
    alignItems: "center",
  },

  selectedCard: {
    backgroundColor: "#ffcc00",
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  suggestion: {
    marginVertical: 10,
    fontSize: 13,
    color: "green",
    fontStyle: "italic",
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    height: 100,
    marginVertical: 15,
  },

  locationBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  submitBtn: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
});