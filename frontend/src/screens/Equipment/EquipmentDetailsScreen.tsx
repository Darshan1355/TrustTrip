import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://10.17.96.190:5000";

export default function EquipmentDetailsScreen({ route }: any) {
  const { item } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [pricePerItem, setPricePerItem] = useState(0);

  const mapRef = useRef<MapView>(null);

  // 🔥 Fetch real price from backend
  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    try {
      const res = await fetch(`${API_URL}/equipment/${item.id}`);
      const data = await res.json();

      setPricePerItem(data.price || 200);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = pricePerItem * quantity;

  // 📍 Get location
  const getLiveLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);

    // fake delivery location
    setDeliveryLocation({
      latitude: location.coords.latitude + 0.01,
      longitude: location.coords.longitude + 0.01,
    });

    setShowMap(true);
  };

  // 🚚 Simulate delivery movement
  useEffect(() => {
    if (!deliveryLocation || !userLocation) return;

    const interval = setInterval(() => {
      setDeliveryLocation((prev: any) => {
        if (!prev) return prev;

        return {
          latitude:
            prev.latitude +
            (userLocation.latitude - prev.latitude) * 0.1,
          longitude:
            prev.longitude +
            (userLocation.longitude - prev.longitude) * 0.1,
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [deliveryLocation, userLocation]);

  // 🧾 PLACE ORDER (CONNECTED TO BACKEND)


const handleOrder = async () => {

  if (!userLocation) {
    Alert.alert("Please share live location first.");
    return;
  }

  const user = await AsyncStorage.getItem("user");

  if (!user) {
    Alert.alert("User not logged in");
    return;
  }

  const parsedUser = JSON.parse(user);

  if (!parsedUser.id) {
    Alert.alert("User ID missing — login issue");
    return;
  }

  const response = await fetch("http://10.17.96.190:5000/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: parsedUser.id,   // ✅ MUST WORK NOW
      equipment_id: Number(item.id),
      quantity: quantity,
      total_price: totalPrice,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    }),
  });

  const data = await response.json();


  if (response.ok) {
    Alert.alert("Success", data.message);
  } else {
    Alert.alert("Error", data.error);
  }
};

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{pricePerItem} / item</Text>
      <Text style={styles.total}>Total: ₹{totalPrice}</Text>

      {/* Quantity */}
      <View style={styles.quantityRow}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => quantity > 1 && setQuantity(quantity - 1)}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyNumber}>{quantity}</Text>

        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <TouchableOpacity style={styles.locationBtn} onPress={getLiveLocation}>
        <Text style={{ color: "#fff" }}>
          {userLocation ? "Location Added ✓" : "Get Live Location"}
        </Text>
      </TouchableOpacity>

      {/* Map */}
      {showMap && userLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          <Marker coordinate={userLocation} title="You" />

          {deliveryLocation && (
            <Marker coordinate={deliveryLocation} title="Delivery" />
          )}
        </MapView>
      )}

      {/* Order */}
      <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Place Order
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  image: { width: "100%", height: 200, resizeMode: "contain" },

  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },

  price: { fontSize: 16, marginTop: 5 },

  total: { fontSize: 18, marginVertical: 10, fontWeight: "bold" },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },

  qtyBtn: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8,
  },

  qtyText: { color: "#fff", fontSize: 18 },

  qtyNumber: { marginHorizontal: 20, fontSize: 18 },

  locationBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },

  map: {
    height: 250,
    marginVertical: 15,
    borderRadius: 15,
  },

  orderBtn: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
});