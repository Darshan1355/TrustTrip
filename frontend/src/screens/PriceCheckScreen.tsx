import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TextInput
} from "react-native";
  

import { Picker } from "@react-native-picker/picker";


const API_URL = "http://10.215.185.190:5000";



export default function PriceCheckScreen() {

const [location,setLocation] = useState("")
const [category,setCategory] = useState("Tourist")   // DEFAULT
const [prices,setPrices] = useState<any[]>([])
const [search,setSearch] = useState("") 

useEffect(()=>{
fetchPrices()
},[])

const fetchPrices = async () => {

try{

const res = await fetch(`${API_URL}/prices`)
const data = await res.json()

setPrices(data)

}catch(error){
console.log("Price fetch error:",error)
}

}


// ---------------- CATEGORY MULTIPLIER ----------------

const getMultiplier = () => {

switch(category){

case "Municipal":
return 1

case "Tourist":
return 1.5

case "Highway":
return 1.3

case "Rural":
return 0.8

default:
return 1

}

}

const multiplier = getMultiplier()


// ---------------- SEARCH FILTER ----------------

const filteredPrices = prices.filter(item =>
item.name.toLowerCase().includes(search.toLowerCase())
)


return(

<View style={styles.container}>

<Text style={styles.title}>Price Transparency</Text>



{/* SEARCH */}

<TextInput
placeholder="Search Product"
style={styles.input}
value={search}
onChangeText={setSearch}
/>


{/* CATEGORY */}

<View style={styles.dropdown}>

<Picker
selectedValue={category}
onValueChange={(value)=>setCategory(value)}
>

<Picker.Item
label="Municipal Corporation Area"
value="Municipal"
/>

<Picker.Item
label="Tourist Place"
value="Tourist"
/>

<Picker.Item
label="Highway / Transit Area"
value="Highway"
/>

<Picker.Item
label="Rural / Other Area"
value="Rural"
/>

</Picker>

</View>


{/* PRICE LIST */}

<FlatList
data={filteredPrices}
keyExtractor={(item)=>item.id.toString()}

renderItem={({item})=>{

const adjustedPrice =
Math.round(item.base_price * multiplier)

return(

<View style={styles.card}>

<Text style={styles.productName}>
{item.name}
</Text>

<Text style={styles.priceText}>
Allowed Price: ₹{adjustedPrice}
</Text>

<Text style={styles.rangeText}>

Acceptable Range:

₹{Math.round(adjustedPrice*0.9)}
 -
 ₹{Math.round(adjustedPrice*1.1)}

</Text>

</View>

)

}}

contentContainerStyle={{paddingBottom:20}}

/>

</View>

)

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 24,
    letterSpacing: 0.5,
  },

  input: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,

    fontSize: 16,
    color: "#111827",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
    marginBottom: 18,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,

    borderLeftWidth: 5,
    borderLeftColor: "#4F46E5",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 7,
  },

  productName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  priceText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 6,
  },

  rangeText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
  },
});