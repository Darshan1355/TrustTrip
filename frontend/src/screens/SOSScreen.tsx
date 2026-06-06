import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function SOSScreen() {
return (
  <View style={styles.container}>
    <View style={styles.emergencyCard}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>🚨</Text>
      </View>

      <Text style={styles.title}>Emergency SOS</Text>

      <Text style={styles.subtitle}>
        Instantly notify nearby authorities,
        emergency services, and trusted contacts
        during critical situations.
      </Text>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={() => alert("SOS Alert Sent (Demo)")}
      >
        <Text style={styles.buttonText}>
          SEND SOS ALERT
        </Text>
      </TouchableOpacity>

      <Text style={styles.warningText}>
        Use only in genuine emergency situations
      </Text>
    </View>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
  },

  emergencyCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,

    elevation: 10,
  },

  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FEE2E2",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 20,
  },

  icon: {
    fontSize: 70,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },

  button: {
    width: "100%",
    backgroundColor: "#DC2626",

    paddingVertical: 18,

    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,

    elevation: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 1,
  },

  warningText: {
    marginTop: 18,
    color: "#EF4444",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "600",
  },
});