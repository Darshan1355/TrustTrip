import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, loginUser }: any) {

const [username, setUsername] = useState("")
const [password, setPassword] = useState("")


const login = async () => {

try {

const res = await fetch("http://10.103.226.190:5000/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})

console.log("STATUS:", res.status)

const text = await res.text()

console.log("RAW RESPONSE:", text)

const data = JSON.parse(text)

if (data.success) {

await AsyncStorage.setItem(
"user",
JSON.stringify(data.user)
)

loginUser(data.user)

} else {

Alert.alert(
"Login Failed",
"Invalid username or password"
)

}

} catch (err) {

console.log("LOGIN ERROR:", err)

Alert.alert(
"Error",
JSON.stringify(err)
)

}

}


return(

<View style={styles.container}>
    <View style={styles.logoContainer}>
  <View style={styles.logoCircle}>
    <Text style={styles.logoEmoji}>🌍</Text>
  </View>

  <Text style={styles.title}>
    TrustTrip
  </Text>

  <Text style={styles.subtitle}>
    Safe • Smart • Trusted Travel Experience
  </Text>
</View>

<Text style={styles.title}>TrustTrip Login</Text>

<View style={styles.inputContainer}>
  <Text style={styles.label}>Username</Text>

  <TextInput
    placeholder="Enter your username"
    style={styles.input}
    onChangeText={setUsername}
    placeholderTextColor="#9CA3AF"
  />
</View>

<View style={styles.inputContainer}>
  <Text style={styles.label}>Password</Text>

  <TextInput
    placeholder="Enter your password"
    style={styles.input}
    secureTextEntry
    onChangeText={setPassword}
    placeholderTextColor="#9CA3AF"
  />
</View>



<TouchableOpacity style={styles.btn} onPress={login}>
<Text style={styles.btnText}>Login</Text>
</TouchableOpacity>

<Text onPress={()=>navigation.navigate("Register")}>
Create Account
</Text>

</View>

)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,

    backgroundColor: "#EEF2FF",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 15,
  },

  logoEmoji: {
    fontSize: 42,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    marginBottom: 35,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 16,

    paddingHorizontal: 18,
    paddingVertical: 15,

    fontSize: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,

    elevation: 2,
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

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#4F46E5",
    fontWeight: "700",
    marginLeft: 4,
  },

  footer: {
    marginTop: 40,
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});