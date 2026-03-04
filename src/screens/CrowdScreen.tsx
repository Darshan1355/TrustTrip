import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

export default function CrowdScreen() {
  const [range, setRange] = useState(500); // default 500 meters

  // Simulated crowd logic
  const peopleCount = Math.floor(range * 0.8);

  let status = "Low";
  let statusColor = "green";

  if (peopleCount > 800) {
    status = "High";
    statusColor = "red";
  } else if (peopleCount > 400) {
    status = "Medium";
    statusColor = "orange";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Crowd Status</Text>

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
          title="Current Location"
        />

        {/* Circle based on range */}
        <Circle
          center={{ latitude: 16.705, longitude: 74.2433 }}
          radius={range}
          strokeColor="rgba(30,136,229,0.8)"
          fillColor="rgba(30,136,229,0.2)"
        />
      </MapView>

      {/* RANGE SELECTOR */}
      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>
          Selected Range: {range} meters
        </Text>

        <Slider
          style={{ width: width - 40, height: 40 }}
          minimumValue={100}
          maximumValue={2000}
          step={100}
          value={range}
          onValueChange={(value) => setRange(value)}
          minimumTrackTintColor="#1e88e5"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* STATUS SECTION */}
      <View style={styles.statusCard}>
        <Text style={styles.peopleText}>
          Approx. People in Area: {peopleCount}
        </Text>

        <Text style={[styles.statusText, { color: statusColor }]}>
          Crowd Status: {status}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    padding: 20,
  },

  map: {
    width: "100%",
    height: 300,
  },

  rangeContainer: {
    padding: 20,
  },

  rangeText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },

  statusCard: {
    backgroundColor: "#ffffff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },

  peopleText: {
    fontSize: 16,
    marginBottom: 10,
  },

  statusText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});