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


const API_URL = "http://10.215.185.190:5000";


type Order = {
  id: number;
  name: string;
  
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

    <View style={styles.iconContainer}>
      <Text style={styles.icon}>🛡️</Text>
    </View>

    <View style={{ flex: 1 }}>

      <Text style={styles.name}>
        {item.name}
      </Text>

      <View style={styles.infoRow}>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>{item.quantity}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Amount</Text>
          <Text style={styles.price}>₹{item.total_price}</Text>
        </View>

      </View>

      <View
        style={[
          styles.statusBadge,
          item.status.toLowerCase() === "pending"
            ? styles.pending
            : item.status.toLowerCase() === "delivered"
            ? styles.delivered
            : styles.cancelled,
        ]}
      >
        <Text style={styles.statusText}>
          {item.status}
        </Text>
      </View>

      <Text style={styles.date}>
        📅 {new Date(item.created_at).toLocaleString()}
      </Text>

    </View>

  </View>

);

return (

<View style={styles.container}>

  <View style={styles.heroCard}>

    <Text style={styles.heroTitle}>
      My Equipment Orders
    </Text>

    <Text style={styles.heroSubtitle}>
      View all your safety equipment rental orders,
      their status and payment details.
    </Text>

  </View>

  <FlatList
    data={orders}
    keyExtractor={(item) => item.id.toString()}
    renderItem={renderItem}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 25 }}
    ListEmptyComponent={
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyText}>
          No Orders Yet
        </Text>
        <Text style={styles.emptySub}>
          Rent safety equipment to see your orders here.
        </Text>
      </View>
    }
  />

</View>

);
}

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:"#F8FAFC",
  padding:16,
},

heroCard:{
  backgroundColor:"#4F46E5",
  padding:20,
  borderRadius:18,
  marginBottom:20,
},

heroTitle:{
  color:"#fff",
  fontSize:24,
  fontWeight:"800",
},

heroSubtitle:{
  color:"#E0E7FF",
  marginTop:8,
  fontSize:14,
  lineHeight:22,
},

card:{
  flexDirection:"row",
  backgroundColor:"#fff",
  borderRadius:18,
  padding:16,
  marginBottom:15,

  shadowColor:"#000",
  shadowOffset:{width:0,height:4},
  shadowOpacity:0.08,
  shadowRadius:8,

  elevation:5,
},

iconContainer:{
  width:65,
  height:65,
  borderRadius:35,
  backgroundColor:"#EEF2FF",
  justifyContent:"center",
  alignItems:"center",
  marginRight:15,
},

icon:{
  fontSize:32,
},

name:{
  fontSize:18,
  fontWeight:"800",
  color:"#111827",
},

infoRow:{
  flexDirection:"row",
  marginTop:12,
},

infoBox:{
  backgroundColor:"#F9FAFB",
  borderRadius:10,
  padding:10,
  marginRight:10,
  flex:1,
},

infoLabel:{
  color:"#6B7280",
  fontSize:12,
},

infoValue:{
  marginTop:4,
  fontWeight:"700",
  fontSize:15,
},

price:{
  marginTop:4,
  fontWeight:"800",
  color:"#4F46E5",
  fontSize:15,
},

statusBadge:{
  alignSelf:"flex-start",
  marginTop:14,
  paddingHorizontal:14,
  paddingVertical:6,
  borderRadius:20,
},

pending:{
  backgroundColor:"#FEF3C7",
},

delivered:{
  backgroundColor:"#DCFCE7",
},

cancelled:{
  backgroundColor:"#FEE2E2",
},

statusText:{
  fontWeight:"700",
  fontSize:13,
},

date:{
  marginTop:12,
  color:"#6B7280",
  fontSize:13,
},

emptyContainer:{
  marginTop:90,
  alignItems:"center",
},

emptyIcon:{
  fontSize:70,
},

emptyText:{
  marginTop:15,
  fontWeight:"800",
  fontSize:22,
  color:"#374151",
},

emptySub:{
  marginTop:8,
  color:"#6B7280",
  textAlign:"center",
  fontSize:14,
  paddingHorizontal:35,
},

});