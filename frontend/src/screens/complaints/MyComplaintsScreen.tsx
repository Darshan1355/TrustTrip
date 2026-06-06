import React, { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyComplaintsScreen() {

const [complaints,setComplaints] = useState([])
const API_URL = "http://10.103.226.190:5000"

useEffect(()=>{
loadComplaints()
},[])

const loadComplaints = async () => {

const user = await AsyncStorage.getItem("user")
const parsed = JSON.parse(user || "{}")

const username = parsed.username

const res = await fetch(`${API_URL}/user-complaints/${username}`)

const data = await res.json()

setComplaints(data)

}

const renderItem = ({ item }: any) => (

  <View style={styles.card}>

    <View style={styles.categoryBadge}>
      <Text style={styles.category}>
        {item.category}
      </Text>
    </View>

    <Text style={styles.desc}>
      {item.description}
    </Text>

    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        📍 Location
      </Text>

      <Text style={styles.infoText}>
        {item.latitude}, {item.longitude}
      </Text>
    </View>

    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>
        🕒 Date
      </Text>

      <Text style={styles.infoText}>
        {item.created_at}
      </Text>
    </View>

  </View>

);

return(

<View style={styles.container}>

<Text style={styles.title}>My Complaints</Text>

<FlatList
data={complaints}
keyExtractor={(item:any)=>item.id.toString()}
renderItem={renderItem}
/>

</View>

)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },

  headerCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
  },

  headerSubtitle: {
    color: "#E0E7FF",
    fontSize: 14,
    lineHeight: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 18,

    marginBottom: 15,

    borderLeftWidth: 5,
    borderLeftColor: "#4F46E5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  categoryBadge: {
    alignSelf: "flex-start",

    backgroundColor: "#EEF2FF",

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 20,

    marginBottom: 12,
  },

  category: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 13,
  },

  desc: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  infoLabel: {
    color: "#6B7280",
    fontSize: 13,
    width: 70,
    fontWeight: "600",
  },

  infoText: {
    color: "#374151",
    fontSize: 13,
    flex: 1,
  },

  time: {
    marginTop: 10,
    color: "#9CA3AF",
    fontSize: 12,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 10,
  },

  emptySubText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 5,
    textAlign: "center",
  },
});