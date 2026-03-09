import React, { useState, useEffect } from "react";
import {
View,
Text,
StyleSheet,
FlatList,
TextInput
} from "react-native";

import { Picker } from "@react-native-picker/picker";

const API_URL = "http://10.17.96.190:5000";

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

container:{
flex:1,
padding:20,
backgroundColor:"#f4f6f8"
},

title:{
fontSize:22,
fontWeight:"bold",
marginBottom:20
},

input:{
backgroundColor:"#fff",
padding:12,
borderRadius:12,
marginBottom:15,
elevation:3
},

dropdown:{
borderWidth:1,
borderRadius:12,
marginBottom:20,
backgroundColor:"#fff"
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:15,
marginBottom:15,
elevation:4
},

productName:{
fontSize:16,
fontWeight:"bold",
marginBottom:8
},

priceText:{
fontSize:15,
color:"#1e88e5",
fontWeight:"600"
},

rangeText:{
marginTop:5,
fontSize:14,
color:"gray"
}

})