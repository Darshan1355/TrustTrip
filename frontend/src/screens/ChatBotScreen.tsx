import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  tag?: string;
  time: string;
  isTyping?: boolean;
};

const getTime = () => {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")} ${
    d.getHours() >= 12 ? "PM" : "AM"
  }`;
};

const QUICK_REPLIES = ["Nearby Hotels", "Police Help", "Safe Route", "Medical Help"];

export default function ChatBotScreen() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your TrustTrip Assistant. How can I help secure your journey today?",
      sender: "bot",
      time: "10:24 AM",
    }

  ]);
  const [isTyping, setIsTyping] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      time: getTime(),
    };
    setChat((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setMessage("");

    let botReply = "I'm analyzing your request. Please stay safe and alert.";
    const lower = message.toLowerCase();

    if (lower.includes("hotel")) {
      botReply = "I found 3 verified hotels within 500m. The nearest is Hotel Plaza at 2 mins walk. Shall I navigate you there?";
    } else if (lower.includes("police")) {
      botReply = "The nearest police station is 0.3 miles away. Tap the SOS button for immediate help or call 100 for Police Emergency.";
    } else if (lower.includes("safe") || lower.includes("safe route")) {
      botReply = "Your current path has a 94% safety score. I recommend taking Rue de Rivoli — it's well-lit and patrolled.";
    } else if (lower.includes("medical") || lower.includes("ambulance")) {
      botReply = "The nearest hospital is 0.4 miles away. For emergency ambulance, tap SOS or call 108 immediately.";
    }

    setTimeout(() => {
      const botMsg: Message = {
        id: Date.now().toString() + "bot",
        text: botReply,
        sender: "bot",
        time: getTime(),
      };
      setChat((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";

    return (
      <View style={[styles.messageRow, isUser && styles.messageRowUser]}>
        {/* Bot avatar */}
        {!isUser && (
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarIcon}>🌐</Text>
          </View>
        )}

        <View style={[styles.bubbleWrap, isUser && styles.bubbleWrapUser]}>
          {/* Analyzing tag */}
          {item.tag && (
            <View style={styles.tagRow}>
              <Text style={styles.tagPin}>📍</Text>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          )}

          <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.bubbleText, isUser && styles.userBubbleText]}>
              {item.text}
            </Text>
          </View>
          <Text style={[styles.timeText, isUser && styles.timeTextUser]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1A2870" />

      {/* ── DARK HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>TrustTrip Assistant</Text>
          <Text style={styles.headerSub}>Your vigilant travel companion is online.</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Encrypted badge */}
      <View style={styles.encryptedBadgeRow}>
        <View style={styles.encryptedBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.encryptedText}>ENCRYPTED & SECURE</Text>
        </View>
      </View>

      {/* ── WHITE CHAT AREA ── */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={chat}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingRow}>
                <Text style={styles.typingDots}>💬</Text>
              </View>
            ) : null
          }
        />

        
       {/* Quick Replies */}
        <View style={styles.quickRepliesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickReplies}
            keyboardShouldPersistTaps="handled"
          >
            {QUICK_REPLIES.map((q, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickChip}
                onPress={() => setMessage(q)}
              >
                <Text style={styles.quickChipText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="Ask something..."
            placeholderTextColor="#9CA3AF"
            style={styles.inputField}
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.micBtn}>
            <Text style={styles.micIcon}>🎤</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1A2870" },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: "#1A2870",
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: { fontSize: 28, color: "#FFFFFF", fontWeight: "300", marginTop: -4 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FFFFFF" },
  headerSub: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 2 },

  /* ENCRYPTED BADGE */
  encryptedBadgeRow: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#1A2870",
  },
  encryptedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  encryptedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },

  /* CHAT AREA */
  chatArea: {
    flex: 1,
    backgroundColor: "#F8FAFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },
  chatList: {
    padding: 16,
    paddingBottom: 8,
  },

  /* MESSAGE ROW */
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 5,
  },
  messageRowUser: {
    flexDirection: "row-reverse",
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  botAvatarIcon: { fontSize: 20 },

  bubbleWrap: { flex: 1, maxWidth: "80%" },
  bubbleWrapUser: { alignItems: "flex-end" },

  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  tagPin: { fontSize: 12 },
  tagText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16A34A",
    letterSpacing: 0.8,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },

  bubble: {
    borderRadius: 18,
    padding: 16,
  },
  botBubble: {
    backgroundColor: "#EEF2FF",
    borderTopLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: "#1A2870",
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
  },
  userBubbleText: { color: "#FFFFFF" },
  timeText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 5,
  },
  timeTextUser: { textAlign: "right" },

  /* TYPING INDICATOR */
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  typingDots: { fontSize: 14, color: "#9CA3AF", letterSpacing: 2 },
  typingLabel: { fontSize: 13, color: "#9CA3AF", fontStyle: "italic" },

  // {quick Replies */}
quickRepliesWrapper: {
  height: 52,
  backgroundColor: "#FFFFFF",
  borderTopWidth: 1,
  borderTopColor: "#E5E7EB",
  justifyContent: "center",
},

quickReplies: {
  paddingHorizontal: 16,
  alignItems: "center",
},

quickChip: {
  backgroundColor: "#EEF2FF",
  borderRadius: 20,
  paddingHorizontal: 14,
  paddingVertical: 8,
  marginRight: 10,
  borderWidth: 1,
  borderColor: "#C7D2FE",
},

quickChipText: {
  color: "#4338CA",
  fontSize: 14,
  fontWeight: "600",
},

  /* INPUT BAR */
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 10,
  },
  inputField: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: { fontSize: 18 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1A2870",
    justifyContent: "center",
    alignItems: "center",
  },
  sendIcon: { fontSize: 16, color: "#FFFFFF" },


});
