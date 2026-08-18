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
import api from "../../config/api";
import {
  createPaymentOrder,
  markPaymentFailed,
  openRazorpayCheckout,
  verifyPayment,
} from "../../services/paymentService";


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

export default function EquipmentDetailsScreen({ route, navigation }: any) {
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

  // Create and verify the payment through the backend. The backend is authoritative for amount and status.
  const handleOrder = async () => {
    if (!userLocation) {
      Alert.alert("Location required", "Please share live location before paying.");
      return;
    }

    setPlacingOrder(true);
    let paymentOrder: Awaited<ReturnType<typeof createPaymentOrder>> | null = null;
    let checkoutCompleted = false;
    try {
      paymentOrder = await createPaymentOrder(Number(item.id), quantity, userLocation);
      const checkoutResponse = await openRazorpayCheckout(paymentOrder, item.name);
      checkoutCompleted = true;
      const verified = await verifyPayment(paymentOrder.order_id, checkoutResponse);

      navigation.replace("PaymentSuccess", {
        paymentId: verified.payment_id,
        orderId: verified.order_id,
        amount: paymentOrder.amount,
        equipmentName: paymentOrder.equipment_name || item.name,
      });
    } catch (error: any) {
      const description = error?.description || error?.message || "Payment could not be completed.";
      if (paymentOrder?.order_id && !checkoutCompleted) {
        try {
          await markPaymentFailed(paymentOrder.order_id, description);
        } catch {
          // Payment failure reporting is best effort; preserve the original error state.
        }

      Alert.alert("Payment not completed", description, [{ text: "Try again" }]);
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>


      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Equipment image card */}
        <View style={styles.imageContainer}>
          <View style={styles.imageCircle}>
            <Image
              source={{
                uri: equipmentImages[item.id % equipmentImages.length],
              }}
              style={styles.image}
            />
          </View>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, styles.badgeStock]}>
              <Text style={styles.badgeStockText}>
                {item?.inStock === false ? "Out of Stock" : "In Stock"}
              </Text>
            </View>
            <View style={[styles.badge, styles.badgePriority]}>
              <Text style={styles.badgePriorityText}>
                {item?.priority || "High Priority"}
              </Text>
            </View>
          </View>
        </View>

        {/* Name / price / total card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsTopRow}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              {loadingPrice ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <>
                  <Text style={styles.priceValue}>{`\u20B9${pricePerItem}`}</Text>
                  <Text style={styles.priceUnit}> /day</Text>
                </>
              )}
            </Text>
          </View>

          <Text style={styles.description}>
            {item?.description || "Advanced field trauma supplies."}
          </Text>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {`Total Estimate (x${quantity})`}
            </Text>
            <Text style={styles.totalValue}>{`\u20B9${totalPrice}`}</Text>
          </View>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>{"\u24D8"}</Text>
          <Text style={styles.infoText}>
            Equipment is inspected and sterilized before every rental.
            Deliveries are typically completed within 2 hours in central
            metropolitan areas.
          </Text>
        </View>

        {/* Quantity + Share location row */}
        <View style={styles.actionRow}>
          <View style={styles.quantityCard}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{quantity}</Text>

            <TouchableOpacity
              style={[styles.qtyBtn, styles.qtyBtnDark]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.locationBtn, gettingLocation && { opacity: 0.7 }]}
            onPress={getLiveLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.locationText}>
                {userLocation ? "Location Added \u2713" : "\u25CE  Share Location"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Map */}
        {showMap && userLocation && (
          <View style={styles.mapContainer}>
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

            <View style={styles.deliveryOverlay}>
              <View style={styles.deliveryIconWrap}>
                <Text style={styles.deliveryIconText}>{"\uD83D\uDE9A"}</Text>
              </View>
              <View>
                <Text style={styles.deliveryTitle}>Delivery Vehicle</Text>
                <Text style={styles.deliverySubtitle}>Est. 45 mins away</Text>
              </View>
            </View>
          </View>
        )}

        {/* spacer so last content isn't hidden behind footer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer - Place Order button stays fixed at bottom and is always clickable */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.orderBtn, placingOrder && { opacity: 0.7 }]}
          onPress={handleOrder}
          disabled={placingOrder}
        >
          {placingOrder ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.orderText}>
              {`Pay Now - \u20B9${totalPrice}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E7FF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerIconText: {
    fontSize: 18,
    color: "#1E3A8A",
    fontWeight: "700",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1E3A8A",
  },

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

    padding: 24,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  imageCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#E8ECFB",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "55%",
    height: "55%",
    resizeMode: "contain",
  },

  badgeRow: {
    flexDirection: "row",
    marginTop: 18,
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 6,
  },

  badgeStock: {
    backgroundColor: "#D1FAE5",
  },

  badgeStockText: {
    color: "#059669",
    fontWeight: "700",
    fontSize: 13,
  },

  badgePriority: {
    backgroundColor: "#E5E7EB",
  },

  badgePriorityText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 13,
  },

  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginTop: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  detailsTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    flexShrink: 1,
    paddingRight: 10,
  },

  price: {
    fontSize: 16,
  },

  priceValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E3A8A",
  },

  priceUnit: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },

  totalValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10B981",
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 18,
    marginTop: 16,
  },

  infoIcon: {
    fontSize: 18,
    color: "#1E3A8A",
    marginRight: 10,
    marginTop: 2,
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: "row",
    marginTop: 20,
  },

  quantityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
    marginRight: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#E0E7FF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  qtyBtnDark: {
    backgroundColor: "#1E3A8A",
  },

  qtyText: {
    color: "#1E3A8A",
    fontSize: 20,
    fontWeight: "800",
  },

  qtyNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  locationBtn: {
    backgroundColor: "#065F46",
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flex: 1.2,

    shadowColor: "#065F46",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  locationText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
  },

  mapContainer: {
    marginTop: 20,
    borderRadius: 22,
    overflow: "hidden",
  },

  map: {
    height: 260,
    width: "100%",
  },

  deliveryOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  deliveryIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  deliveryIconText: {
    fontSize: 16,
  },

  deliveryTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  deliverySubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
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

  orderBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    width: "100%",

    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 5 },
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
});
