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


export default function EquipmentDetailsScreen({ route }: any) {
  const { item } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  const mapRef = useRef<MapView>(null);

  const pricePerItem = 200;
  const totalPrice = pricePerItem * quantity;

  // Request location
  const getLiveLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setUserLocation(location.coords);

    // Simulate delivery starting point
    setDeliveryLocation({
      latitude: location.coords.latitude + 0.01,
      longitude: location.coords.longitude + 0.01,
    });

    setShowMap(true);
  };

  // Simulate real-time delivery movement
  useEffect(() => {
    if (!deliveryLocation || !userLocation) return;

    const interval = setInterval(() => {
      setDeliveryLocation((prev: any) => {
        if (!prev) return prev;

        const newLat =
          prev.latitude +
          (userLocation.latitude - prev.latitude) * 0.1;
        const newLng =
          prev.longitude +
          (userLocation.longitude - prev.longitude) * 0.1;

        return { latitude: newLat, longitude: newLng };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [deliveryLocation, userLocation]);

  // Send notification


  const handleOrder = async () => {
    if (!userLocation) {
      Alert.alert("Please share live location first.");
      return;
    }

    

    Alert.alert(
      "Order Placed",
      `Product: ${item.name}\nQuantity: ${quantity}\nTotal: ₹${totalPrice}`
    );
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>₹{pricePerItem} / item</Text>
      <Text style={styles.total}>Total: ₹{totalPrice}</Text>

      {/* Quantity Controls */}
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

      {/* Live Location */}
      <TouchableOpacity style={styles.locationBtn} onPress={getLiveLocation}>
        <Text style={{ color: "#fff" }}>Get Live Location</Text>
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
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />

          {deliveryLocation && (
            <Marker
              coordinate={deliveryLocation}
              title="Delivery Partner"
              pinColor="red"
            />
          )}
        </MapView>
      )}

      {/* Order Button */}
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