import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Darshan</Text>
      <Text style={styles.email}>darshan@email.com</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 60 },
  back: { alignSelf: "flex-start", marginLeft: 20, fontSize: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginVertical: 20 },
  name: { fontSize: 22, fontWeight: "bold" },
  email: { fontSize: 16, color: "gray", marginBottom: 20 },
  button: {
    backgroundColor: "#1e88e5",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});