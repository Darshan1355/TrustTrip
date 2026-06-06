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

const API_URL = "http://10.215.185.190:5000"

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

const text = await response.text()



const data = JSON.parse(text)

setName(data.name || "")
setMobile(data.mob || "")
setAddress(data.address || "")
setNationality(data.nationality || "")
setEmergency(data.emergency_contact || "")

const complaintRes = await fetch(`${API_URL}/user-complaints/${uname}`)

const complaintText = await complaintRes.text()



const complaintData = JSON.parse(complaintText)
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


<View style={styles.profileStatsContainer}>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      {complaintCount}
    </Text>
    <Text style={styles.statLabel}>
      Complaints
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      100%
    </Text>
    <Text style={styles.statLabel}>
      Verified
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statNumber}>
      ✓
    </Text>
    <Text style={styles.statLabel}>
      Active
    </Text>
  </View>

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
  onPress={() => navigation.navigate("MyOrders")}
>
  <Text style={styles.sectionTitle}>My Orders</Text>
  <Text style={styles.statText}>View your equipment orders</Text>
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
  container: {
    padding: 20,
    backgroundColor: "#F8FAFC",
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,

    borderWidth: 4,
    borderColor: "#EEF2FF",

    marginBottom: 12,
  },

  username: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  card: {
    backgroundColor: "#FFFFFF",

    padding: 20,

    borderRadius: 24,

    marginBottom: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 8,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 14,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#F9FAFB",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 14,

    paddingHorizontal: 14,
    paddingVertical: 12,

    fontSize: 15,
    color: "#111827",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editText: {
    color: "#4F46E5",
    fontWeight: "700",
    fontSize: 14,
  },

  saveBtn: {
    backgroundColor: "#4F46E5",

    paddingVertical: 14,

    borderRadius: 16,

    marginTop: 20,

    alignItems: "center",

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  dashboardCard: {
    backgroundColor: "#FFFFFF",

    width: "100%",

    paddingVertical: 22,
    paddingHorizontal: 15,

    borderRadius: 22,

    alignItems: "center",

    marginBottom: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,

    elevation: 6,
  },

  dashboardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  dashboardNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
    marginTop: 6,
  },

  dashboardSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 5,
    textAlign: "center",
  },

  statText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },

  logoutBtn: {
    backgroundColor: "#DC2626",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",

    marginTop: 10,

    shadowColor: "#DC2626",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  profileStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 18,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4F46E5",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
});