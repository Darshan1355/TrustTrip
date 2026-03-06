import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
View,
Text,
StyleSheet,
Image,
TouchableOpacity,
TextInput,
ScrollView,
Alert,
} from "react-native";

export default function ProfileScreen({ logoutUser }: any) {

const [isEditing, setIsEditing] = useState(false)

const [username,setUsername] = useState("")
const [name, setName] = useState("")
const [mob, setMobile] = useState("")
const [address, setAddress] = useState("")
const [nationality, setNationality] = useState("")
const [emergency_contact, setEmergency] = useState("")

const API_URL = "http://10.17.96.190:5000"



// ---------------- FETCH PROFILE ----------------
const fetchProfile = async () => {

try{

const user = await AsyncStorage.getItem("user")
if (!user) {
  Alert.alert("Error", "User data not found")
  return
}
const parsedUser = JSON.parse(user)

const uname = parsedUser.username
setUsername(uname)

const response = await fetch(`${API_URL}/profile/${uname}`)

const data = await response.json()

setName(data.name || "")
setMobile(data.mob || "")
setAddress(data.address || "")
setNationality(data.nationality || "")
setEmergency(data.emergency_contact || "")

}catch(error){
console.log(error)
Alert.alert("Error","Unable to load profile")
}

}

useEffect(()=>{
fetchProfile()
},[])



// ---------------- SAVE PROFILE ----------------
const handleSave = async () => {

try{

const response = await fetch(`${API_URL}/profile/${username}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name,
mob,
address,
nationality,
emergency_contact
})
})

const data = await response.json()

if(response.ok){
Alert.alert("Success","Profile Updated Successfully")
setIsEditing(false)
}else{
Alert.alert("Error",data.message)
}

}catch(error){
Alert.alert("Error","Failed to update profile")
}

}



const handleLogout = async () => {

await AsyncStorage.removeItem("user")
logoutUser()

}



return(

<ScrollView contentContainerStyle={styles.container}>

<Image
source={{
uri:"https://cdn-icons-png.flaticon.com/512/149/149071.png",
}}
style={styles.avatar}
/>


<View style={styles.card}>

<View style={styles.rowBetween}>
<Text style={styles.sectionTitle}>Personal Information</Text>

<TouchableOpacity onPress={()=>setIsEditing(!isEditing)}>
<Text style={styles.editText}>{isEditing?"Cancel":"Edit"}</Text>
</TouchableOpacity>

</View>



<Text style={styles.label}>Name</Text>
{isEditing?(
<TextInput style={styles.input} value={name} onChangeText={setName}/>
):(
<Text style={styles.value}>{name}</Text>
)}



<Text style={styles.label}>Mobile</Text>
{isEditing?(
<TextInput
style={styles.input}
value={mob}
onChangeText={setMobile}
keyboardType="numeric"
/>
):(
<Text style={styles.value}>{mob}</Text>
)}



<Text style={styles.label}>Address</Text>
{isEditing?(
<TextInput style={styles.input} value={address} onChangeText={setAddress}/>
):(
<Text style={styles.value}>{address}</Text>
)}



<Text style={styles.label}>Nationality</Text>
{isEditing?(
<TextInput style={styles.input} value={nationality} onChangeText={setNationality}/>
):(
<Text style={styles.value}>{nationality}</Text>
)}



<Text style={styles.label}>Emergency Contact</Text>
{isEditing?(
<TextInput
style={styles.input}
value={emergency_contact}
onChangeText={setEmergency}
keyboardType="numeric"
/>
):(
<Text style={styles.value}>{emergency_contact}</Text>
)}



{isEditing && (
<TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
<Text style={styles.saveText}>Save Changes</Text>
</TouchableOpacity>
)}

</View>



<View style={styles.card}>
<Text style={styles.sectionTitle}>Bookings</Text>
<Text style={styles.statText}>Total Equipment Bookings: 5</Text>
</View>


<View style={styles.card}>
<Text style={styles.sectionTitle}>Guides</Text>
<Text style={styles.statText}>Total Guides Booked: 3</Text>
</View>


<View style={styles.card}>
<Text style={styles.sectionTitle}>Complaints</Text>
<Text style={styles.statText}>Total Complaints Raised: 2</Text>
</View>



<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
<Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>


</ScrollView>

)

}



const styles = StyleSheet.create({

container:{
padding:20,
paddingBottom:40,
backgroundColor:"#f4f6f8",
},

avatar:{
width:130,
height:130,
borderRadius:65,
alignSelf:"center",
marginBottom:25,
},

card:{
backgroundColor:"#ffffff",
padding:18,
borderRadius:18,
marginBottom:20,
elevation:4,
},

sectionTitle:{
fontSize:18,
fontWeight:"bold",
marginBottom:12,
},

label:{
fontSize:13,
color:"gray",
marginTop:8,
},

value:{
fontSize:15,
marginTop:4,
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
padding:10,
marginTop:4,
},

rowBetween:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
},

editText:{
color:"#1e88e5",
fontWeight:"600",
},

saveBtn:{
backgroundColor:"#1e88e5",
padding:12,
borderRadius:12,
marginTop:15,
alignItems:"center",
},

saveText:{
color:"#fff",
fontWeight:"600",
},

statText:{
fontSize:15,
marginTop:6,
},

logoutBtn:{
backgroundColor:"#e53935",
padding:14,
borderRadius:15,
alignItems:"center",
marginTop:10,
},

logoutText:{
color:"#fff",
fontWeight:"bold",
fontSize:16,
}

})