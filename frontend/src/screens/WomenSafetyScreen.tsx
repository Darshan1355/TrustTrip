import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function WomenSafetyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety Facilities</Text>

      <Text style={styles.item}>🚻 Nearby Washrooms</Text>
      <Text style={styles.item}>🍼 Baby Feeding Rooms</Text>
      <Text style={styles.item}>🛑 Safe Zones</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: { fontSize: 16, marginVertical: 10 },
});