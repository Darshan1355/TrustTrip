import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function RegisterScreen({ navigation }: any) {

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [name,setName]=useState("")
const [mob,setMobile]=useState("")
const [address,setAddress]=useState("")
const [nationality,setNationality]=useState("")
const [emergency_contact,setEmergencyContact]=useState("")

const register = async () => {

const res = await fetch("http://10.17.96.190:5000/register",{
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

<View style={styles.container}>

<Text style={styles.title}>Register</Text>

<TextInput placeholder="Username" style={styles.input} onChangeText={setUsername}/>
<TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={setPassword}/>
<TextInput placeholder="Full Name" style={styles.input} onChangeText={setName}/>
<TextInput placeholder="Mobile" style={styles.input} onChangeText={setMobile}/>
<TextInput placeholder="Address" style={styles.input} onChangeText={setAddress}/>
<TextInput placeholder="Nationality" style={styles.input} onChangeText={setNationality}/>
<TextInput placeholder="Emergency Contact" style={styles.input} onChangeText={setEmergencyContact}/>

<TouchableOpacity style={styles.btn} onPress={register}>
<Text style={styles.btnText}>Register</Text>
</TouchableOpacity>

<Text onPress={()=>navigation.navigate("Login")}>
Already have account? Login
</Text>

</View>

)

}

const styles = StyleSheet.create({
container:{flex:1,justifyContent:"center",padding:20},
title:{fontSize:26,fontWeight:"bold",marginBottom:20},
input:{borderWidth:1,padding:10,marginBottom:10},
btn:{backgroundColor:"#1e88e5",padding:12},
btnText:{color:"#fff",textAlign:"center"}
})