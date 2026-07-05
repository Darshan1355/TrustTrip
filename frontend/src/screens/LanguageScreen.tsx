import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://10.215.185.190:5000";

export default function LanguageScreen() {

  const [text, setText] = useState("");

  const [displayText, setDisplayText] = useState("");

  const [sourceLanguage, setSourceLanguage] = useState("auto");

  const [targetLanguage, setTargetLanguage] = useState("hi");

  const [loading, setLoading] = useState(false);

  // Typing Animation
  const typeWriter = (sentence: string) => {

    setDisplayText("");

    const words = sentence.split(" ");

    let current = "";

    words.forEach((word, index) => {

      setTimeout(() => {

        current += word + " ";

        setDisplayText(current);

      }, index * 120);

    });

  };

  const translate = async () => {

    if (text.trim() === "") return;

    setLoading(true);

    setDisplayText("");

    try {

      const response = await fetch(`${API_URL}/translate`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({

          text: text,

          source: sourceLanguage,

          target: targetLanguage,

        }),

      });

      const data = await response.json();

      setLoading(false);

      if (data.success) {

        typeWriter(data.translation);

      } else {

        setDisplayText("Translation Failed");

      }

    } catch (error) {

      setLoading(false);

      console.log(error);

      setDisplayText("Unable to connect to server.");

    }

  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.heading}>
        🌍 Travel Language Translator
      </Text>

      <Text style={styles.subHeading}>
        Translate any language instantly
      </Text>

      <Text style={styles.label}>
        From
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sourceLanguage}
          onValueChange={(itemValue) =>
            setSourceLanguage(itemValue)
          }>

          <Picker.Item label="Auto Detect" value="auto" />
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="French" value="fr" />
          <Picker.Item label="German" value="de" />
          <Picker.Item label="Japanese" value="ja" />
          <Picker.Item label="Spanish" value="es" />

        </Picker>
      </View>

      <Text style={styles.label}>
        To
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={targetLanguage}
          onValueChange={(itemValue) =>
            setTargetLanguage(itemValue)
          }>

          <Picker.Item label="English" value="en" />
          <Picker.Item label="Hindi" value="hi" />
          <Picker.Item label="Marathi" value="mr" />
          <Picker.Item label="French" value="fr" />
          <Picker.Item label="German" value="de" />
          <Picker.Item label="Japanese" value="ja" />
          <Picker.Item label="Spanish" value="es" />

        </Picker>
      </View>

      <TextInput
        multiline
        placeholder="Type your text here..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && { opacity: 0.7 }
        ]}
        disabled={loading}
        onPress={translate}
      >

        <Text style={styles.buttonText}>
          {loading ? "Translating..." : "Translate"}
        </Text>

      </TouchableOpacity>

      <Text style={styles.outputTitle}>
        Translation
      </Text>

      <View style={styles.outputBox}>

        {loading ? (

          <View style={styles.loaderContainer}>

            <ActivityIndicator
              size="large"
              color="#1e88e5"
            />

            <Text style={styles.loadingText}>
              Translating...
            </Text>

          </View>

        ) : (

          <Text style={styles.output}>
            {displayText}
          </Text>

        )}

      </View>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F4F6F8",
    padding:20,
  },

  heading:{
    fontSize:28,
    fontWeight:"bold",
    textAlign:"center",
    marginTop:20,
    color:"#1e88e5",
  },

  subHeading:{
    textAlign:"center",
    color:"#666",
    marginTop:5,
    marginBottom:25,
    fontSize:15,
  },

  label:{
    fontSize:16,
    fontWeight:"700",
    marginBottom:8,
    marginTop:10,
  },

  pickerContainer:{
    backgroundColor:"#fff",
    borderRadius:12,
    marginBottom:15,
    elevation:3,
  },

  input:{
    backgroundColor:"#fff",
    minHeight:170,
    borderRadius:15,
    padding:18,
    fontSize:17,
    textAlignVertical:"top",
    elevation:3,
  },

  button:{
    backgroundColor:"#1e88e5",
    marginTop:25,
    padding:16,
    borderRadius:15,
    alignItems:"center",
    elevation:4,
  },

  buttonText:{
    color:"#fff",
    fontSize:18,
    fontWeight:"bold",
  },

  outputTitle:{
    fontSize:20,
    fontWeight:"bold",
    marginTop:30,
    marginBottom:10,
  },

  outputBox:{
    backgroundColor:"#fff",
    borderRadius:15,
    minHeight:180,
    padding:20,
    elevation:3,
    marginBottom:40,
  },

  output:{
    fontSize:19,
    lineHeight:32,
    color:"#222",
  },

  loaderContainer:{
    justifyContent:"center",
    alignItems:"center",
    flex:1,
    minHeight:140,
  },

  loadingText:{
    marginTop:15,
    fontSize:16,
    color:"#666",
  },

});