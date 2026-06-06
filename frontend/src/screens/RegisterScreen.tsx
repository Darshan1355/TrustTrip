import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function RegisterScreen({ navigation }: any) {

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [name,setName]=useState("")
const [mob,setMobile]=useState("")
const [address,setAddress]=useState("")
const [nationality,setNationality]=useState("")
const [emergency_contact,setEmergencyContact]=useState("")

const register = async () => {

const res = await fetch("http://10.103.226.190:5000/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username,
password,
name,
mob,
address,
nationality,
emergency_contact
})
})

const data = await res.json()

if(data.success){
alert("Registration successful")
navigation.replace("Login")
}else{
alert("Registration failed")
}

}

return(

<ScrollView
  style={styles.container}
  showsVerticalScrollIndicator={false}
>

    <View style={styles.header}>

  <View style={styles.logoCircle}>
    <Text style={styles.logoText}>🌍</Text>
  </View>

  <Text style={styles.title}>
    Create Account
  </Text>

  <Text style={styles.subtitle}>
    Join TrustTrip and travel safer with
    verified services and emergency support.
  </Text>

</View>

<Text style={styles.title}>Register</Text>

<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Username
  </Text>

  <TextInput
    placeholder="Choose a username"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setUsername}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Password
  </Text>

  <TextInput
    placeholder="Create a password"
    style={styles.input}
    secureTextEntry
    placeholderTextColor="#9CA3AF"
    onChangeText={setPassword}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Full Name
  </Text>

  <TextInput
    placeholder="Enter your full name"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setName}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Mobile
  </Text>

  <TextInput
    placeholder="Enter your mobile number"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setMobile}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Address
  </Text>

  <TextInput
    placeholder="Enter your address"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setAddress}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Nationality
  </Text>

  <TextInput
    placeholder="Enter your nationality"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setNationality}
  />
</View>
<View style={styles.inputGroup}>
  <Text style={styles.label}>
    Emergency Contact
  </Text>

  <TextInput
    placeholder="Enter emergency contact information"
    style={styles.input}
    placeholderTextColor="#9CA3AF"
    onChangeText={setEmergencyContact}
  />
</View>

<TouchableOpacity style={styles.btn} onPress={register}>
<Text style={styles.btnText}>Register</Text>
</TouchableOpacity>

<Text onPress={()=>navigation.navigate("Login")}>
Already have account? Login
</Text>

<View style={styles.footer}>
  <Text style={styles.footerText}>
    🔒 Your information is securely protected
  </Text>
</View>

</ScrollView>

)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 24,
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoCircle: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    backgroundColor: "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 15,
  },

  logoText: {
    fontSize: 38,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },

  formCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    padding: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 4,
  },

  inputGroup: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F9FAFB",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 16,

    paddingHorizontal: 16,
    paddingVertical: 14,

    fontSize: 15,

    color: "#111827",
  },

  btn: {
    backgroundColor: "#4F46E5",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",

    marginTop: 10,

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 8,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 30,
  },

  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#4F46E5",
    fontWeight: "700",
    marginLeft: 5,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});