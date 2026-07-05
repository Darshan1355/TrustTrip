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

const API_URL = "http://10.215.185.190:5000";

type Guide = {
  g_id: number;
  name: string;
  languages: string;
  status: string;
  rating: number;
};

const guideImages = [

"https://randomuser.me/api/portraits/men/11.jpg",

"https://randomuser.me/api/portraits/women/21.jpg",

"https://randomuser.me/api/portraits/men/31.jpg",

"https://randomuser.me/api/portraits/women/41.jpg",

"https://randomuser.me/api/portraits/men/51.jpg",

"https://randomuser.me/api/portraits/women/61.jpg",

"https://randomuser.me/api/portraits/men/71.jpg",

"https://randomuser.me/api/portraits/women/81.jpg",

];

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

const renderGuide=({item}:{item:Guide})=>(

<TouchableOpacity
activeOpacity={0.9}
style={styles.card}
>

<Image
source={{
uri:guideImages[item.g_id % guideImages.length]
}}
style={styles.image}
/>

<Text style={styles.name}>
{item.name}
</Text>

<Text style={styles.language}>
🌍 {item.languages}
</Text>

<View
style={[
styles.status,
{
backgroundColor:
item.status==="Available"
?"#DCFCE7"
:"#FEE2E2"
}
]}
>

<Text
style={{
color:
item.status==="Available"
?"#16A34A"
:"#DC2626",
fontWeight:"700",
fontSize:12
}}
>
{item.status}
</Text>

</View>

<View style={styles.ratingBox}>

<Text style={styles.ratingText}>
⭐ {item.rating.toFixed(1)}
</Text>

</View>

<TouchableOpacity
style={styles.selectBtn}
onPress={()=>selectGuide(item.g_id)}
>

<Text style={styles.btnText}>
Book Guide
</Text>

</TouchableOpacity>

{
selectedGuide===item.g_id&&(

<>

<StarRating
rating={rating}
onChange={setRating}
starSize={22}
/>

<TouchableOpacity
style={styles.rateBtn}
onPress={()=>submitRating(item.g_id)}
>

<Text style={styles.btnText}>
Rate
</Text>

</TouchableOpacity>

</>

)

}

</TouchableOpacity>

)

    
  



return(

<View style={{flex:1}}>

        <View
            style={{
                backgroundColor: "#4F46E5",
                margin: 16,
                borderRadius: 10,
                padding: 22,
            }}
            >
            <Text
                style={{
                color: "#fff",
                fontSize: 22,
                fontWeight: "800",
                marginBottom: 6,
                }}
            >
                Tourist Guides
            </Text>

            <Text
                style={{
                color: "#E0E7FF",
                fontSize: 14,
                lineHeight: 22,
                }}
            >
                Connect with verified local guides and
                explore destinations with confidence.
            </Text>
        </View>

         <FlatList
  data={guides}
  keyExtractor={(item) => item.g_id.toString()}
  renderItem={renderGuide}
  numColumns={2}
  columnWrapperStyle={{
    justifyContent: "space-between",
    paddingHorizontal: 16,
  }}
  contentContainerStyle={{
    paddingBottom: 30,
  }}
  showsVerticalScrollIndicator={false}
/>

</View>

)

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 10,
  },

  heroCard: {
    backgroundColor: "#4F46E5",
    margin: 16,
    borderRadius: 24,
    padding: 22,
    elevation: 6,
  },

  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  heroText: {
    color: "#E0E7FF",
    fontSize: 15,
    lineHeight: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    width: "48%",
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 6,
  },

  image: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },

  language: {
    marginTop: 5,
    fontSize: 13,
    color: "#666",
    textAlign: "center",
  },

  status: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  ratingBox: {
    marginTop: 10,
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  ratingText: {
    color: "#FF9800",
    fontWeight: "700",
    fontSize: 14,
  },

  selectBtn: {
    backgroundColor: "#4F46E5",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  rateBtn: {
    backgroundColor: "#10B981",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,

    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
  },

  ratingSection: {
    width: "100%",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
  },

  selectedBadge: {
    backgroundColor: "#DCFCE7",
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },

  selectedText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 13,
  },

});