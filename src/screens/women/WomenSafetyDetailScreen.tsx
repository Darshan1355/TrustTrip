import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

export default function WomenSafetyDetailScreen() {
  const route = useRoute<any>();
  const { facility } = route.params;

  const handleBooking = () => {
    Alert.alert(
      "Booking Confirmed",
      `${facility.name} has been booked successfully.`
    );
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 16.705,
          longitude: 74.2433,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: 16.705, longitude: 74.2433 }}
          title={facility.name}
        />
      </MapView>

      {/* DETAILS */}
      <View style={styles.details}>
        <Text style={styles.name}>{facility.name}</Text>

        <Text
          style={[
            styles.status,
            { color: facility.available ? "green" : "red" },
          ]}
        >
          {facility.available ? "Available" : "Not Available"}
        </Text>

        {facility.available && (
          <TouchableOpacity style={styles.button} onPress={handleBooking}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: {
    width: "100%",
    height: "55%",
  },

  details: {
    padding: 20,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  status: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: "600",
  },

  button: {
    backgroundColor: "#e91e63",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});