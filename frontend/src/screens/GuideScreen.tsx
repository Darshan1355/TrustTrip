import React, { useEffect, useState } from "react";
import {
View,
Text,
FlatList,
TouchableOpacity,
Image,
Alert,
StyleSheet
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import StarRating from "react-native-star-rating-widget";

const API_URL = "http://10.17.96.190:5000";

type Guide = {
g_id: number
name: string
languages: string
status: string
profile_photo: string
rating: number
}

export default function GuideScreen(){

const [guides,setGuides] = useState<Guide[]>([])
const [selectedGuide,setSelectedGuide] = useState<number | null>(null)
const [rating,setRating] = useState(0)

useEffect(()=>{
fetchGuides()
},[])

const fetchGuides = async ()=>{

try{

const res = await fetch(`${API_URL}/guides`)
const data = await res.json()

setGuides(data)

}catch(error){
console.log(error)
}

}

const selectGuide = async (guideId:number)=>{

const userData = await AsyncStorage.getItem("user")

if(!userData){
Alert.alert("Error","User not logged in")
return
}

const user = JSON.parse(userData)
const username = user.username

setSelectedGuide(guideId)

await fetch(`${API_URL}/select-guide`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
guide_id:guideId,
username:username
})
})

Alert.alert("Guide Selected")

}

const submitRating = async (guideId:number)=>{

const userData = await AsyncStorage.getItem("user")

if(!userData){
Alert.alert("Error","User not logged in")
return
}

const user = JSON.parse(userData)
const username = user.username

await fetch(`${API_URL}/rate-guide`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
guide_id:guideId,
username:username,
rating:rating
})
})

Alert.alert("Rating submitted ⭐")

setRating(0)

fetchGuides()

}

const renderGuide = ({item}:{item:Guide})=>(

<View style={styles.card}>

<Image
source={{uri:`${API_URL}/static/guides/${item.profile_photo}`}}
style={styles.image}
/>

<Text style={styles.name}>{item.name}</Text>
<Text>Languages: {item.languages}</Text>
<Text>Status: {item.status}</Text>

<Text style={styles.rating}>
Average Rating ⭐ {item.rating?.toFixed(1)}
</Text>

<TouchableOpacity
style={styles.selectBtn}
onPress={()=>selectGuide(item.g_id)}
>
<Text style={styles.btnText}>Select Guide</Text>
</TouchableOpacity>


{selectedGuide === item.g_id && (

<View style={{marginTop:10}}>

<StarRating
rating={rating}
onChange={setRating}
maxStars={5}
/>

<TouchableOpacity
style={styles.rateBtn}
onPress={()=>submitRating(item.g_id)}
>

<Text style={styles.btnText}>Submit Rating</Text>

</TouchableOpacity>

</View>

)}

</View>

)

return(

<View style={{flex:1}}>

<FlatList
data={guides}
keyExtractor={(item)=>item.g_id.toString()}
renderItem={renderGuide}
/>

</View>

)

}

const styles = StyleSheet.create({

card:{
padding:15,
margin:10,
borderWidth:1,
borderRadius:10,
backgroundColor:"#fff"
},

image:{
width:100,
height:100,
marginBottom:10
},

name:{
fontSize:18,
fontWeight:"bold"
},

rating:{
marginTop:5,
fontSize:16
},

selectBtn:{
backgroundColor:"#007bff",
padding:10,
marginTop:10,
borderRadius:5
},

rateBtn:{
backgroundColor:"#28a745",
padding:10,
marginTop:10,
borderRadius:5
},

btnText:{
color:"#fff",
textAlign:"center"
}

})