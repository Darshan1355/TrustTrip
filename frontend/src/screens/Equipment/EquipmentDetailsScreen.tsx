import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../config/api";


const equipmentImages = [
  "https://cdn-icons-png.flaticon.com/512/3062/3062634.png", // Helmet
  "https://cdn-icons-png.flaticon.com/512/2965/2965567.png", // First Aid Kit
  "https://cdn-icons-png.flaticon.com/512/1048/1048941.png", // Torch
  "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", // Backpack
  "https://cdn-icons-png.flaticon.com/512/3659/3659898.png", // Life Jacket
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png", // Medical Kit
  "https://cdn-icons-png.flaticon.com/512/4149/4149675.png", // Whistle
  "https://cdn-icons-png.flaticon.com/512/942/942748.png", // Emergency Kit
];

export default function EquipmentDetailsScreen({ route }: any) {
  const { item } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);
  const [pricePerItem, setPricePerItem] = useState(0);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const mapRef = useRef<MapView>(null);

  // 🔥 Fetch real price from backend
  useEffect(() => {
    fetchPrice();
  }, []);

  const fetchPrice = async () => {
    if (!item || !item.id) return;
    setLoadingPrice(true);
    try {
      const res = await api.get(`/equipment/${item.id}`);
      const data = res.data;
      if (data && typeof data.price !== "undefined") setPricePerItem(Number(data.price));
      else setPricePerItem(200);
    } catch (error) {
      console.log("fetchPrice error:", error);
      setPricePerItem(200);
    } finally {
      setLoadingPrice(false);
    }
  };

  const totalPrice = pricePerItem * quantity;

  // 📍 Get location
  const getLiveLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please allow location access in settings.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);

      // fake delivery location (start a little offset)
      setDeliveryLocation({
        latitude: location.coords.latitude + 0.01,
        longitude: location.coords.longitude + 0.01,
      });

      setShowMap(true);
    } catch (err) {
      console.log("getLiveLocation error:", err);
      Alert.alert("Error", "Unable to get location");
    } finally {
      setGettingLocation(false);
    }
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

  setPlacingOrder(true);
  try {
    const response = await api.post("/place-order", {
      user_id: parsedUser.id,
      equipment_id: Number(item.id),
      quantity: quantity,
      total_price: totalPrice,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    });

    const data = response.data;
    if (response.status >= 200 && response.status < 300) {
      Alert.alert("Success", data.message || "Order placed successfully");
    } else {
      Alert.alert("Error", data.error || "Order failed");
    }
  } catch (err) {
    console.log("placeOrder error:", err);
    Alert.alert("Error", "Failed to place order. Please try again.");
  } finally {
    setPlacingOrder(false);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: styles.container.backgroundColor }}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: equipmentImages[item.id % equipmentImages.length],
          }}
          style={styles.image}
        />
      </View>

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>
        {loadingPrice ? <ActivityIndicator size="small" color="#4F46E5" /> : `₹${pricePerItem} / item`}
      </Text>
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
      <View style={styles.quantityCard}>
        <Text style={styles.quantityTitle}>Select Quantity</Text>
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
      </View>

      {/* Location */}
      <TouchableOpacity style={[styles.locationBtn, gettingLocation && { opacity: 0.7 }]} onPress={getLiveLocation} disabled={gettingLocation}>
        {gettingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff" }}>{userLocation ? "Location Added ✓" : "Get Live Location"}</Text>
        )}
      </TouchableOpacity>

      {/* Map */}
      {showMap && userLocation && (
        <View style={styles.mapContainer}>
          <Text style={styles.mapTitle}>Delivery Tracker</Text>
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

            {deliveryLocation && <Marker coordinate={deliveryLocation} title="Delivery" />}
          </MapView>
        </View>
      )}

      {/* spacer so last content isn't hidden behind footer */}
      <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer - Place Order button stays fixed at bottom and is always clickable */}
      <View style={styles.footer}> 
        <TouchableOpacity style={[styles.orderBtn, placingOrder && { opacity: 0.7 }]} onPress={handleOrder} disabled={placingOrder}>
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.orderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    paddingBottom: 140,
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
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },
});