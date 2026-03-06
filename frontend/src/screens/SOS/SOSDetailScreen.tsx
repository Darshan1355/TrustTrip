import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";

export default function SOSDetailScreen() {
  const route = useRoute<any>();
  const { emergency } = route.params;

  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const sendSOS = () => {
    Alert.alert(
      "SOS Alert Sent",
      `Emergency alert sent to ${emergency.name}`
    );
  };

  const callNumber = () => {
    Linking.openURL(`tel:${emergency.number}`);
  };

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
          />
        </MapView>
      )}

      <View style={styles.details}>
        <Text style={styles.title}>{emergency.name}</Text>

        <Text style={styles.number}>
          Emergency Number: {emergency.number}
        </Text>

        <TouchableOpacity style={styles.callBtn} onPress={callNumber}>
          <Text style={styles.btnText}>Call Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sosBtn} onPress={sendSOS}>
          <Text style={styles.btnText}>Send SOS Alert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  map: {
    width: "100%",
    height: "55%",
  },

  details: {
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  number: {
    fontSize: 16,
    marginBottom: 20,
  },

  callBtn: {
    backgroundColor: "#1e88e5",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  sosBtn: {
    backgroundColor: "red",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});