import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, loginUser }: any) {

const [username, setUsername] = useState("")
const [password, setPassword] = useState("")

const login = async () => {

try{

const res = await fetch("http://10.17.96.190:5000/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({username,password})
})

const data = await res.json()

if(data.success){

// SAVE USER INFO
await AsyncStorage.setItem("user", JSON.stringify(data.user))

loginUser(data.user)

}else{
Alert.alert("Login Failed","Invalid username or password")
}

}catch(err){
Alert.alert("Error","Server not reachable")
}

}

return(

<View style={styles.container}>

<Text style={styles.title}>TrustTrip Login</Text>

<TextInput
placeholder="Username"
style={styles.input}
onChangeText={setUsername}
/>

<TextInput
placeholder="Password"
style={styles.input}
secureTextEntry
onChangeText={setPassword}
/>

<TouchableOpacity style={styles.btn} onPress={login}>
<Text style={styles.btnText}>Login</Text>
</TouchableOpacity>

<Text onPress={()=>navigation.navigate("Register")}>
Create Account
</Text>

</View>

)

}

const styles=StyleSheet.create({

container:{flex:1,justifyContent:"center",padding:20},

title:{fontSize:28,fontWeight:"bold",marginBottom:20},

input:{borderWidth:1,padding:10,marginBottom:10,borderRadius:8},

btn:{backgroundColor:"#1e88e5",padding:12,borderRadius:8},

btnText:{color:"#fff",textAlign:"center"}

})