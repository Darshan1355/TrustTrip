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
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const handleSubmit = async () => {
  if (!selectedCategory) {
    Alert.alert("Please select a complaint category.");
    return;
  }

  try {
    // GET LOGGED IN USER
    const user = await AsyncStorage.getItem("user");

    if (!user) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    const parsedUser = JSON.parse(user);
    const username = parsedUser.username;

    const response = await fetch("http://10.103.226.190:5000/complaint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,   // ✅ dynamic username
        category: selectedCategory,
        description: complaint,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", data.message);

      setComplaint("");
      setSelectedCategory("");
      setLocation(null);
    } else {
      Alert.alert("Error", data.message);
    }

  } catch (error) {
    Alert.alert("Error", "Could not submit complaint");
  }
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
      <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>
            Community Issue Reporting
          </Text>

          <Text style={styles.headerSubtitle}>
            Report problems instantly and help improve safety,
            cleanliness, accessibility, and tourist experiences.
          </Text>
      </View>

      {/* Category Grid */}
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item}
        columnWrapperStyle={{ justifyContent: "space-between" }}
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

  categoryCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",

    paddingVertical: 16,
    paddingHorizontal: 10,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  selectedCard: {
    backgroundColor: "#EEF2FF",
    borderColor: "#4F46E5",
    borderWidth: 2,
  },

  categoryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  suggestion: {
    backgroundColor: "#ECFDF5",

    borderLeftWidth: 4,
    borderLeftColor: "#10B981",

    padding: 14,
    borderRadius: 12,

    marginTop: 8,
    marginBottom: 16,

    color: "#065F46",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 18,

    padding: 16,
    height: 130,

    textAlignVertical: "top",

    fontSize: 15,
    color: "#111827",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,

    marginBottom: 18,
  },

  locationBtn: {
    backgroundColor: "#2563EB",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 6,

    marginBottom: 15,
  },

  submitBtn: {
    backgroundColor: "#F97316",

    paddingVertical: 18,

    borderRadius: 18,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#F97316",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 6,
  },

  locationBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  headerCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  headerSubtitle: {
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 22,
  },
});