import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PriceCheckScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Transparency</Text>

      <Text style={styles.item}>🥥 Coconut Water: ₹30 - ₹40</Text>
      <Text style={styles.item}>🚕 Auto Fare/km: ₹15</Text>
      <Text style={styles.item}>🎫 Monument Ticket: ₹50</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  item: { fontSize: 16, marginVertical: 8 },
});