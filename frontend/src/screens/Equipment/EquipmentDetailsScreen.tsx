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

<<<<<<< HEAD
const API_URL = "http://10.215.185.190:5000";
=======
const API_URL = "https://trusttrip-nng1.onrender.com";
>>>>>>> origin/main

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

  const response = await fetch("http://10.103.226.190:5000/place-order", {
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
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      </View>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{pricePerItem} / item</Text>
      <Text style={styles.total}>Total: ₹{totalPrice}</Text>
      <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Safety Equipment Rental
          </Text>

          <Text style={styles.infoText}>
            Rent verified safety equipment with live
            delivery tracking and secure ordering.
          </Text>
      </View>

      {/* Quantity */}
        <Text style={styles.quantityTitle}>
          Select Quantity
        </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
  },

  imageContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,

    alignItems: "center",
    justifyContent: "center",

    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "contain",
  },

  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginTop: 18,
  },

  price: {
    fontSize: 18,
    color: "#4F46E5",
    fontWeight: "700",
    marginTop: 8,
  },

  total: {
    fontSize: 24,
    fontWeight: "800",
    color: "#10B981",
    marginTop: 10,
  },

  quantityCard: {
    backgroundColor: "#FFFFFF",

    marginTop: 20,

    borderRadius: 20,

    padding: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  quantityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },

  quantityRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  qtyBtn: {
    width: 48,
    height: 48,

    backgroundColor: "#4F46E5",

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  qtyText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },

  qtyNumber: {
    marginHorizontal: 25,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  locationBtn: {
    backgroundColor: "#10B981",

    paddingVertical: 15,

    borderRadius: 18,

    alignItems: "center",

    marginTop: 20,

    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  locationText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  mapContainer: {
    marginTop: 20,
  },

  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  map: {
    height: 260,
    borderRadius: 22,
    overflow: "hidden",
  },

  orderBtn: {
    backgroundColor: "#F97316",

    paddingVertical: 18,

    borderRadius: 20,

    alignItems: "center",

    marginTop: 20,

    shadowColor: "#F97316",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,

    elevation: 6,
  },

  orderText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  infoCard: {
    backgroundColor: "#EEF2FF",

    padding: 15,

    borderRadius: 18,

    marginTop: 15,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
  },

  infoText: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 5,
    lineHeight: 20,
  },
});