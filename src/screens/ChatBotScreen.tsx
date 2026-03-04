import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function ChatBotScreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([
    { id: "1", text: "Hi 👋 I'm your Tourist Assistant! How can I help you?", sender: "bot" },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg = { id: Date.now().toString(), text: message, sender: "user" };
    setChat((prev) => [...prev, userMsg]);

    let botReply = "Sorry, I didn't understand that.";

    if (message.toLowerCase().includes("hotel")) {
      botReply = "You can check nearby hotels in the Guide section.";
    } else if (message.toLowerCase().includes("police")) {
      botReply = "For police help, go to SOS Emergency and tap Police.";
    } else if (message.toLowerCase().includes("transport")) {
      botReply = "You can use local taxi apps or check bus stations nearby.";
    } else if (message.toLowerCase().includes("safe")) {
      botReply = "Avoid isolated areas at night and use Women Safety feature.";
    }

    const botMsg = {
      id: Date.now().toString() + "bot",
      text: botReply,
      sender: "bot",
    };

    setTimeout(() => {
      setChat((prev) => [...prev, botMsg]);
    }, 600);

    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chat}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "user" ? styles.userMsg : styles.botMsg,
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask something..."
          style={styles.input}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8", padding: 10, marginBottom: 30},

  message: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: "75%",
  },

  userMsg: {
    backgroundColor: "#1e88e5",
    alignSelf: "flex-end",
  },

  botMsg: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
    marginTop: 40,
  },

  text: { color: "#000" },

  inputContainer: {
    flexDirection: "row",
    marginTop: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },

  sendBtn: {
    backgroundColor: "#1e88e5",
    padding: 12,
    marginLeft: 10,
    borderRadius: 10,
  },
});