import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";

export default function LanguageScreen() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Assistance</Text>

      <TextInput
        placeholder="Type your message..."
        style={styles.input}
        value={text}
        onChangeText={setText}
      />

      <Button title="Translate" onPress={() => alert("Translated (Demo)")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
});