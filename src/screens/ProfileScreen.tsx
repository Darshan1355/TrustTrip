import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Darshan");
  const [mobile, setMobile] = useState("9876543210");
  const [address, setAddress] = useState("Kolhapur, Maharashtra");
  const [nationality, setNationality] = useState("Indian");
  const [emergency, setEmergency] = useState("9123456789");

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Success", "Profile Updated Successfully!");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "You have been logged out.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Image */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        }}
        style={styles.avatar}
      />

      {/* PERSONAL INFO SECTION */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editText}>
              {isEditing ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.value}>{name}</Text>
        )}

        {/* Mobile */}
        <Text style={styles.label}>Mobile</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{mobile}</Text>
        )}

        {/* Address */}
        <Text style={styles.label}>Address</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
          />
        ) : (
          <Text style={styles.value}>{address}</Text>
        )}

        {/* Nationality */}
        <Text style={styles.label}>Nationality</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={nationality}
            onChangeText={setNationality}
          />
        ) : (
          <Text style={styles.value}>{nationality}</Text>
        )}

        {/* Emergency Contact */}
        <Text style={styles.label}>Emergency Contact</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={emergency}
            onChangeText={setEmergency}
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.value}>{emergency}</Text>
        )}

        {isEditing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* BOOKINGS SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Bookings</Text>
        <Text style={styles.statText}>Total Equipment Bookings: 5</Text>
      </View>

      {/* GUIDES SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Guides</Text>
        <Text style={styles.statText}>Total Guides Booked: 3</Text>
      </View>

      {/* COMPLAINTS SECTION */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Complaints</Text>
        <Text style={styles.statText}>Total Complaints Raised: 2</Text>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f4f6f8",
  },

  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignSelf: "center",
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: "gray",
    marginTop: 8,
  },

  value: {
    fontSize: 15,
    marginTop: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editText: {
    color: "#1e88e5",
    fontWeight: "600",
  },

  saveBtn: {
    backgroundColor: "#1e88e5",
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontWeight: "600",
  },

  statText: {
    fontSize: 15,
    marginTop: 6,
  },

  logoutBtn: {
    backgroundColor: "#e53935",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});