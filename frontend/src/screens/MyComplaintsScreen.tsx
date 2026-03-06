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
const API_URL = "http://10.17.96.190:5000"

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

const renderItem = ({item}:any) => (

<View style={styles.card}>

<Text style={styles.category}>{item.category}</Text>

<Text style={styles.desc}>{item.description}</Text>

<Text style={styles.loc}>
Location: {item.latitude}, {item.longitude}
</Text>

<Text style={styles.time}>{item.created_at}</Text>

</View>

)

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

container:{
flex:1,
padding:20,
backgroundColor:"#f4f6f8"
},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20
},

card:{
backgroundColor:"#fff",
padding:15,
borderRadius:12,
marginBottom:12
},

category:{
fontWeight:"bold",
fontSize:16
},

desc:{
marginTop:5
},

loc:{
marginTop:5,
fontSize:12,
color:"gray"
},

time:{
marginTop:5,
fontSize:11,
color:"gray"
}

})