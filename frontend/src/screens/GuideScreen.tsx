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

const API_URL = "http://10.103.226.190:5000";

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

  <View style={styles.imageContainer}>
    <Image
      source={{
        uri: `${API_URL}/static/guides/${item.profile_photo}`
      }}
      style={styles.image}
    />
  </View>

  <Text style={styles.name}>
    {item.name}
  </Text>

  <View style={styles.infoRow}>
    <Text style={styles.label}>Languages</Text>
    <Text style={styles.value}>{item.languages}</Text>
  </View>

  <View style={styles.infoRow}>
    <Text style={styles.label}>Status</Text>
    <Text
      style={[
        styles.value,
        {
          color:
            item.status === "Available"
              ? "#10B981"
              : "#EF4444",
        },
      ]}
    >
      {item.status}
    </Text>
  </View>

  <View style={styles.ratingBox}>
    <Text style={styles.rating}>
      ⭐ {item.rating?.toFixed(1)} Average Rating
    </Text>
  </View>

  <TouchableOpacity
    style={styles.selectBtn}
    onPress={() => selectGuide(item.g_id)}
  >
    <Text style={styles.btnText}>
      Select Guide
    </Text>
  </TouchableOpacity>

  {selectedGuide === item.g_id && (
    <View style={styles.ratingSection}>

      <View style={styles.selectedBadge}>
        <Text style={styles.selectedText}>
          ✓ Guide Selected
        </Text>
      </View>

      <StarRating
        rating={rating}
        onChange={setRating}
        maxStars={5}
      />

      <TouchableOpacity
        style={styles.rateBtn}
        onPress={() => submitRating(item.g_id)}
      >
        <Text style={styles.btnText}>
          Submit Rating
        </Text>
      </TouchableOpacity>

    </View>
  )}

</View>

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
        keyExtractor={(item)=>item.g_id.toString()}
        renderItem={renderGuide}
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

  card: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 16,
    marginVertical: 10,

    borderRadius: 24,

    padding: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,

    elevation: 8,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },

  imageContainer: {
    alignItems: "center",
    marginBottom: 14,
  },

  name: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  label: {
    color: "#6B7280",
    fontSize: 14,
    width: 90,
    fontWeight: "600",
  },

  value: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },

  ratingBox: {
    marginTop: 15,
    backgroundColor: "#FEF3C7",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  rating: {
    color: "#92400E",
    fontSize: 16,
    fontWeight: "700",
  },

  selectBtn: {
    backgroundColor: "#4F46E5",

    paddingVertical: 14,
    borderRadius: 16,

    marginTop: 18,

    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  rateBtn: {
    backgroundColor: "#10B981",

    paddingVertical: 14,
    borderRadius: 16,

    marginTop: 15,

    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
  },

  btnText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.3,
  },

  ratingSection: {
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  selectedBadge: {
    backgroundColor: "#DCFCE7",
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  selectedText: {
    color: "#15803D",
    fontWeight: "700",
    fontSize: 13,
  },
});