import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SOSScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🚨</Text>
      <Text style={styles.title}>Emergency SOS</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("SOS Alert Sent (Demo)")}
      >
        <Text style={styles.buttonText}>SEND SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { fontSize: 80 },
  title: { fontSize: 22, fontWeight: "bold", marginVertical: 20 },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});