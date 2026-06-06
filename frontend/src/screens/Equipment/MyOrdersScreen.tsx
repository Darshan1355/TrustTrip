import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.103.226.190:5000";

type Order = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
};

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const parsedUser = JSON.parse(user);
      const user_id = parsedUser.id;

      const res = await fetch(`${API_URL}/user-orders/${user_id}`)
      const data = await res.json();

      setOrders(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to load orders");
    }
  };

  const renderItem = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: `${API_URL}/static/equipment/${item.image}` }}
        style={styles.image}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Total: ₹{item.total_price}</Text>

        <Text style={styles.status}>
          Status: {item.status}
        </Text>

        <Text style={styles.date}>
          {new Date(item.created_at).toLocaleString()}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No Orders Yet
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },

  image: {
    width: 80,
    height: 80,
    marginRight: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  status: {
    marginTop: 5,
    fontWeight: "600",
    color: "green",
  },

  date: {
    marginTop: 5,
    fontSize: 12,
    color: "gray",
  },
});