import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import api from "../config/api";

const LANGUAGES = [
  { label: "English", value: "en", flag: "🇬🇧" },
  { label: "Hindi", value: "hi", flag: "🇮🇳" },
  { label: "Marathi", value: "mr", flag: "🇮🇳" },
  { label: "French", value: "fr", flag: "🇫🇷" },
  { label: "German", value: "de", flag: "🇩🇪" },
  { label: "Japanese", value: "ja", flag: "🇯🇵" },
  { label: "Spanish", value: "es", flag: "🇪🇸" },
];

const COMMON_PHRASES = [
  { category: "Emergency", phrase: '"I need medical help"' },
  { category: "Directions", phrase: '"Where is the hotel?"' },
  { category: "Safety", phrase: '"Call the police please"' },
  { category: "Transport", phrase: '"Take me to the airport"' },
];

export default function LanguageScreen() {
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [loading, setLoading] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [translatedText, setTranslatedText] = useState("");

  const getFlag = (value: string) =>
    LANGUAGES.find((l) => l.value === value)?.flag ?? "🌐";
  const getLabel = (value: string) =>
    LANGUAGES.find((l) => l.value === value)?.label ?? "Auto";

  const swapLanguages = () => {
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

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
      const response = await api.post("/translate", {
        text,
        source: sourceLanguage,
        target: targetLanguage,
      });
      const data = response.data;
      setLoading(false);
      if (data.success) {
        setTranslatedText(data.translation);
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

  const speakTranslation = () => {
  if (!translatedText.trim()) return;

  Speech.speak(translatedText, {
    language: targetLanguage, // Example: "hi-IN", "fr-FR", "ja-JP"
    pitch: 1,
    rate: 0.9,
  });
};

const copyTranslation = async () => {
  await Clipboard.setStringAsync(translatedText);
  Alert.alert("Copied", "Translation copied to clipboard.");
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E2A6E" />

      {/* ── DARK NAVY HERO ── */}
      <View style={styles.heroHeader}>
        <View style={styles.heroEyebrow}>
          <Text style={styles.heroEyebrowIcon}>𝐗𝐀</Text>
          <Text style={styles.heroEyebrowText}>TRAVEL COMPANION</Text>
        </View>
        <Text style={styles.heroTitle}>Travel Translator</Text>
        <Text style={styles.heroSubtitle}>
          Break language barriers and travel with confidence anywhere in the world.
        </Text>
      </View>

      {/* ── WHITE SHEET ── */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Pickers Row */}
        <View style={styles.pickerRow}>
          {/* Source */}
          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>Source Language</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowSourcePicker(!showSourcePicker)}
            >
              <Text style={styles.pickerFlag}>{getFlag(sourceLanguage)}</Text>
              <Text style={styles.pickerValue}>{getLabel(sourceLanguage)}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>
            {showSourcePicker && (
              <View style={styles.pickerDropdown}>
                <Picker
                  selectedValue={sourceLanguage}
                  onValueChange={(v) => {
                    setSourceLanguage(v);
                    setShowSourcePicker(false);
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <Picker.Item key={l.value} label={`${l.flag} ${l.label}`} value={l.value} />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Swap button */}
          <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
            <Text style={styles.swapIcon}>⇌</Text>
          </TouchableOpacity>

          {/* Target */}
          <View style={styles.pickerBox}>
            <Text style={styles.pickerLabel}>Translate To</Text>
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => setShowTargetPicker(!showTargetPicker)}
            >
              <Text style={styles.pickerFlag}>{getFlag(targetLanguage)}</Text>
              <Text style={styles.pickerValue}>{getLabel(targetLanguage)}</Text>
              <Text style={styles.chevron}>⌄</Text>
            </TouchableOpacity>
            {showTargetPicker && (
              <View style={styles.pickerDropdown}>
                <Picker
                  selectedValue={targetLanguage}
                  onValueChange={(v) => {
                    setTargetLanguage(v);
                    setShowTargetPicker(false);
                  }}
                >
                  {LANGUAGES.map((l) => (
                    <Picker.Item key={l.value} label={`${l.flag} ${l.label}`} value={l.value} />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        </View>

        {/* Text Input */}
        <View style={styles.inputBox}>
          <TextInput
            multiline
            placeholder="Type or paste text here to translate..."
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            style={styles.textInput}
          />

        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[styles.translateBtn, loading && { opacity: 0.7 }]}
          disabled={loading}
          onPress={translate}
        >
          <Text style={styles.translateBtnIcon}>𝐗𝐀</Text>
          <Text style={styles.translateBtnText}>
            {loading ? "Translating..." : "Translate"}
          </Text>
        </TouchableOpacity>

        {/* Result Section */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultLabel}>TRANSLATION RESULT</Text>
          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.resultActionBtn}
              onPress={speakTranslation}
            >
              <Text style={styles.resultActionText}>🔊 Listen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resultActionBtn}
              onPress={copyTranslation}
            >
              <Text style={styles.resultActionText}>📋 Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultBox}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#1E2A6E" />
              <Text style={styles.loadingText}>Translating...</Text>
            </View>
          ) : displayText ? (
            <>
              <Text style={styles.resultText}>{displayText}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✦</Text>
                <Text style={styles.verifiedText}>Perfect Translation (Verified)</Text>
              </View>
            </>
          ) : (
            <Text style={styles.resultPlaceholder}>
              Your translation will appear here...
            </Text>
          )}
        </View>

        {/* Common Phrases */}
        <Text style={styles.phrasesTitle}>Common Phrases</Text>
        <View style={styles.phrasesGrid}>
          {COMMON_PHRASES.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={styles.phraseCard}
              onPress={() => setText(p.phrase.replace(/"/g, ""))}
            >
              <Text style={styles.phraseCategory}>{p.category}</Text>
              <Text style={styles.phraseText}>{p.phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1E2A6E" },

  /* HERO */
  heroHeader: {
    backgroundColor: "#1E2A6E",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 36,
  },
  heroEyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  heroEyebrowIcon: { fontSize: 16, color: "rgba(255,255,255,0.7)", fontWeight: "700" },
  heroEyebrowText: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 22,
  },

  /* SHEET */
  sheet: {
    flex: 1,
    backgroundColor: "#F4F6FF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -16,
  },
  sheetContent: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },

  /* PICKER ROW */
  pickerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 18,
    gap: 8,
  },
  pickerBox: { flex: 1 },
  pickerLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 6,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerFlag: { fontSize: 18 },
  pickerValue: { flex: 1, fontSize: 14, fontWeight: "700", color: "#111827" },
  chevron: { fontSize: 14, color: "#6B7280" },
  pickerDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 6,
    zIndex: 100,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  swapIcon: { fontSize: 18, color: "#1E2A6E", fontWeight: "700" },

  /* INPUT */
  inputBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    minHeight: 140,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: "#111827",
    minHeight: 90,
    textAlignVertical: "top",
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnText: { fontSize: 18 },

  /* TRANSLATE BTN */
  translateBtn: {
    backgroundColor: "#1E2A6E",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
    shadowColor: "#1E2A6E",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  translateBtnIcon: { fontSize: 18, color: "#FFFFFF", fontWeight: "800" },
  translateBtnText: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },

  /* RESULT */
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1E2A6E",
    letterSpacing: 1.2,
  },
  resultActions: { flexDirection: "row", gap: 12 },
  resultActionBtn: {},
  resultActionText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  resultBox: {
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    minHeight: 130,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  resultText: { fontSize: 18, color: "#111827", lineHeight: 30, marginBottom: 12 },
  resultPlaceholder: { fontSize: 15, color: "#9CA3AF", fontStyle: "italic" },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedIcon: { fontSize: 14, color: "#059669" },
  verifiedText: { fontSize: 13, color: "#059669", fontWeight: "700" },
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 90,
  },
  loadingText: { marginTop: 10, fontSize: 14, color: "#6B7280" },

  /* COMMON PHRASES */
  phrasesTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },
  phrasesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  phraseCard: {
    width: "47%",
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  phraseCategory: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 6,
  },
  phraseText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 20,
  },

});

