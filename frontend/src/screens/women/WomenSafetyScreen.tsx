import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const facilities = [
  {
    id: "1",
    name: "Washroom Facility",
    image: "https://cdn-icons-png.flaticon.com/512/747/747376.png",
    available: true,
  },
  {
    id: "2",
    name: "Baby Feeding Room",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    available: true,
  },
  {
    id: "3",
    name: "Safe Waiting Area",
    image: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    available: false,
  },
  {
    id: "4",
    name: "Safety Vehicle",
    image: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    available: true,
  },
  {
    id: "5",
    name: "Safety Assistant",
    image: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    available: false,
  },
];

export default function WomenSafetyScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety Facilities</Text>

      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.cardContainer}
            onPress={() =>
              navigation.navigate("WomenSafetyDetail", { facility: item })
            }
          >
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>

            <Text style={styles.name}>{item.name}</Text>

            <Text
              style={[
                styles.status,
                { color: item.available ? "green" : "red" },
              ]}
            >
              {item.available ? "Available" : "Not Available"}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  cardContainer: {
    alignItems: "center",
    marginBottom: 25,
  },

  card: {
    width: "100%",
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },

  name: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  status: {
    marginTop: 5,
    fontWeight: "bold",
  },
});