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

export default function ProfileScreen({ logoutUser, navigation }: any) {

const [isEditing, setIsEditing] = useState(false)
const [complaintCount, setComplaintCount] = useState(0)

const [username,setUsername] = useState("")
const [name, setName] = useState("")
const [mob, setMobile] = useState("")
const [address, setAddress] = useState("")
const [nationality, setNationality] = useState("")
const [emergency_contact, setEmergency] = useState("")

const API_URL = "http://10.17.96.190:5000"

useEffect(()=>{
fetchProfile()
},[])


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

const complaintRes = await fetch(`${API_URL}/user-complaints/${uname}`)
const complaintData = await complaintRes.json()

setComplaintCount(complaintData.length)

}catch(error){
console.log(error)
Alert.alert("Error","Unable to load profile")
}

}


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

if(response.ok){
Alert.alert("Success","Profile Updated")
setIsEditing(false)
}else{
Alert.alert("Error","Update failed")
}

}catch(error){
Alert.alert("Error","Failed to update profile")
}

}


// ---------------- LOGOUT ----------------
const handleLogout = async () => {

await AsyncStorage.removeItem("user")
logoutUser()

}


return(

<ScrollView contentContainerStyle={styles.container}>

{/* HEADER */}

<View style={styles.header}>

<Image
source={{
uri:"https://cdn-icons-png.flaticon.com/512/149/149071.png"
}}
style={styles.avatar}
/>

<Text style={styles.username}>{username}</Text>

</View>


{/* PERSONAL INFO CARD */}

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


{/* DASHBOARD CARDS */}

<View style={styles.dashboardRow}>

<TouchableOpacity
style={styles.dashboardCard}
onPress={()=>navigation.navigate("MyComplaints")}
>

<Text style={styles.dashboardTitle}>Complaints</Text>
<Text style={styles.dashboardNumber}>{complaintCount}</Text>
<Text style={styles.dashboardSub}>View Details</Text>

</TouchableOpacity>


<TouchableOpacity
style={styles.dashboardCard}
onPress={()=>navigation.navigate("Guide")}
>

<Text style={styles.dashboardTitle}>Guides</Text>
<Text style={styles.dashboardNumber}>Explore</Text>
<Text style={styles.dashboardSub}>Book a Guide</Text>

</TouchableOpacity>

</View>


{/* LOGOUT */}

<TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
<Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

</ScrollView>

)

}



const styles = StyleSheet.create({

container:{
padding:20,
backgroundColor:"#f2f5f9",
},

header:{
alignItems:"center",
marginBottom:20
},

avatar:{
width:110,
height:110,
borderRadius:55,
marginBottom:10
},

username:{
fontSize:20,
fontWeight:"bold"
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:16,
marginBottom:20,
elevation:4
},

sectionTitle:{
fontSize:18,
fontWeight:"bold"
},

label:{
fontSize:13,
color:"gray",
marginTop:8
},

value:{
fontSize:15,
marginTop:3
},

input:{
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
padding:10,
marginTop:4
},

rowBetween:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

editText:{
color:"#1e88e5",
fontWeight:"600"
},

saveBtn:{
backgroundColor:"#1e88e5",
padding:12,
borderRadius:10,
marginTop:15,
alignItems:"center"
},

saveText:{
color:"#fff",
fontWeight:"bold"
},

dashboardRow:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
},

dashboardCard:{
backgroundColor:"#fff",
width:"48%",
padding:20,
borderRadius:16,
alignItems:"center",
elevation:4
},

dashboardTitle:{
fontSize:16,
fontWeight:"bold"
},

dashboardNumber:{
fontSize:22,
fontWeight:"bold",
marginTop:5,
color:"#1e88e5"
},

dashboardSub:{
fontSize:12,
color:"gray",
marginTop:3
},

logoutBtn:{
backgroundColor:"#e53935",
padding:14,
borderRadius:15,
alignItems:"center"
},

logoutText:{
color:"#fff",
fontWeight:"bold",
fontSize:16
}

})