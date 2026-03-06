import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const guides = [
  {
    id: "1",
    name: "Ravi Kumar",
    age: 32,
    contact: "9876543210",
    price: 1200,
    rating: 4.8,
    languages: "English, Hindi",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    country: "India",
    state: "Maharashtra",
    district: "Kolhapur",
    taluka: "Karveer",
    city: "Kolhapur",
  },
  {
    id: "2",
    name: "Meena Patil",
    age: 28,
    contact: "9123456780",
    price: 1500,
    rating: 4.6,
    languages: "Marathi, English",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    country: "India",
    state: "Maharashtra",
    district: "Satara",
    taluka: "Karad",
    city: "Nandgaon",
  },
];

export default function GuideScreen() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [city, setCity] = useState("");

  const filteredGuides = guides.filter((guide) => {
    return (
      guide.name.toLowerCase().includes(search.toLowerCase()) &&
      (country ? guide.country === country : true) &&
      (state ? guide.state === state : true) &&
      (district ? guide.district === district : true) &&
      (taluka ? guide.taluka === taluka : true) &&
      (city ? guide.city === city : true)
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Guide Booking</Text>

      {/* ✅ Improved Search Bar */}
      <TextInput
        placeholder="Search guide..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {/* Filters */}
      <View style={styles.dropdown}>
        <Picker selectedValue={country} onValueChange={setCountry}>
          <Picker.Item label="Select Country" value="" />
          <Picker.Item label="India" value="India" />
        </Picker>
      </View>

      <View style={styles.dropdown}>
        <Picker selectedValue={state} onValueChange={setState}>
          <Picker.Item label="Select State" value="" />
          <Picker.Item label="Maharashtra" value="Maharashtra" />
        </Picker>
      </View>

      <View style={styles.dropdown}>
        <Picker selectedValue={district} onValueChange={setDistrict}>
          <Picker.Item label="Select District" value="" />
          <Picker.Item label="Kolhapur" value="Kolhapur" />
          <Picker.Item label="Satara" value="Satara" />
        </Picker>
      </View>

      <View style={styles.dropdown}>
        <Picker selectedValue={taluka} onValueChange={setTaluka}>
          <Picker.Item label="Select Taluka" value="" />
          <Picker.Item label="Karveer" value="Karveer" />
          <Picker.Item label="Karad" value="Karad" />
        </Picker>
      </View>

      <View style={styles.dropdown}>
        <Picker selectedValue={city} onValueChange={setCity}>
          <Picker.Item label="Select City" value="" />
          <Picker.Item label="Kolhapur" value="Kolhapur" />
          <Picker.Item label="Nandgaon" value="Nandgaon" />
        </Picker>
      </View>

      {/* Guide Cards */}
      <FlatList
        data={filteredGuides}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Age: {item.age}</Text>
              <Text>ID: {item.id}</Text>
              <Text>Contact: {item.contact}</Text>
              <Text>Price: ₹{item.price}/day</Text>
              <Text>Rating: ⭐ {item.rating}</Text>
              <Text>Languages: {item.languages}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  /* ✅ Same style as Equipment Screen */
  searchBar: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  dropdown: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 18,
    marginVertical: 8,
    elevation: 4,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  info: {
    marginLeft: 15,
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
});