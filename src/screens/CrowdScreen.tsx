import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CrowdScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Crowd Status</Text>

      <Text style={styles.low}>🟢 Low Crowd</Text>
      <Text style={styles.medium}>🟡 Medium Crowd</Text>
      <Text style={styles.high}>🔴 High Crowd</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  low: { color: "green", fontSize: 16, marginVertical: 8 },
  medium: { color: "orange", fontSize: 16, marginVertical: 8 },
  high: { color: "red", fontSize: 16, marginVertical: 8 },
});