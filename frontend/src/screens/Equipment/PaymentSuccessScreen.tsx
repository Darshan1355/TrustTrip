import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentSuccessScreen({ route, navigation }: any) {
  const { paymentId, orderId, amount, equipmentName } = route.params || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <View style={styles.checkCircle}><Text style={styles.check}>✓</Text></View>
        <Text style={styles.title}>Payment successful</Text>
        <Text style={styles.subtitle}>Your safety equipment order has been confirmed.</Text>
        <View style={styles.card}>
          <Row label="Equipment" value={equipmentName || "Safety equipment"} />
          <Row label="Order ID" value={orderId || "—"} />
          <Row label="Payment ID" value={paymentId || "—"} />
          <Row label="Amount" value={`₹${Number(amount || 0) / 100}`} />
        </View>
        <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("MyOrders")}>
          <Text style={styles.primaryText}>View my orders</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.secondaryText}>Back to home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value} numberOfLines={1}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  checkCircle: { alignSelf: "center", width: 82, height: 82, borderRadius: 41, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginBottom: 22 },
  check: { color: "#15803D", fontSize: 46, fontWeight: "800" },
  title: { color: "#111827", fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: { color: "#64748B", fontSize: 15, lineHeight: 22, textAlign: "center", marginTop: 10, marginBottom: 28 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 18, gap: 16, shadowColor: "#111827", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  label: { color: "#64748B", fontSize: 14 },
  value: { color: "#111827", fontSize: 14, fontWeight: "700", flexShrink: 1 },
  primary: { backgroundColor: "#4050C8", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginTop: 28 },
  primaryText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  secondary: { alignItems: "center", paddingVertical: 16 },
  secondaryText: { color: "#4050C8", fontWeight: "700", fontSize: 15 },
});
