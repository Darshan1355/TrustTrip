import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import api from "../config/api";

export default function LoginScreen({ navigation, loginUser }: any) {

const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const [loading, setLoading] = useState(false)
const [showPassword, setShowPassword] = useState(false)


const login = async () => {
  if (!username.trim() || !password) {
    Alert.alert("Missing fields", "Please enter username and password.");
    return;
  }

  setLoading(true)
  try {
    const res = await api.post("/login", { username, password });
    const data = res.data;

    if (data && data.success) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      loginUser(data.user);
    } else {
      const msg = (data && data.message) || "Invalid username or password";
      Alert.alert("Login Failed", msg);
    }
  } catch (err: any) {
    console.log("LOGIN ERROR:", err);
    const serverMsg = err?.response?.data || err?.message || String(err);
    Alert.alert("Error", typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
  } finally {
    setLoading(false)
  }

}


return (

<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
>

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>

<View style={{ flex: 1, backgroundColor: "#1E2875" }}>

  {/* Top gradient header with logo */}
  <LinearGradient
    colors={["#1E2875", "#2D3A9E", "#3B4FCB"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.header}
  >
    <View style={styles.logoCircle}>
      <Text style={styles.logoEmoji}>🌍</Text>
    </View>

    <Text style={styles.title}>TrustTrip</Text>

    <Text style={styles.subtitle}>SAFE • SMART • TRUSTED TRAVEL</Text>
  </LinearGradient>

  {/* White rounded card */}
  <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      style={styles.card}
  >

    <Text style={styles.welcomeTitle}>Welcome Back</Text>
    <Text style={styles.welcomeSubtitle}>
      Sign in to access your secure travel dashboard.
    </Text>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Username</Text>

      <View style={styles.inputWrapper}>
        <Feather name="user" size={18} color="#6B7280" style={styles.inputIcon} />
        <TextInput
            placeholder="Enter your username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor="#4F46E5"
            returnKeyType="next"
        />
      </View>
    </View>

    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Password</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.forgotText}>Forgot?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <Feather name="lock" size={18} color="#6B7280" style={styles.inputIcon} />
        <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            selectionColor="#4F46E5"
            returnKeyType="done"
        />
        <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIcon}
        >
          <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </View>

    <TouchableOpacity style={[styles.btn, loading && { opacity: 0.7 }]} onPress={login} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.btnText}>Login</Text>
      )}
    </TouchableOpacity>

    <View style={styles.registerContainer}>
      <Text style={styles.registerText}>Don't have an account? </Text>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerLink}>Create Account</Text>
      </TouchableOpacity>
    </View>

  </ScrollView>

</View>

</TouchableWithoutFeedback>

</KeyboardAvoidingView>

);

}

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    paddingBottom: 90,
    alignItems: "center",
  },

  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  logoEmoji: {
    fontSize: 42,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#C7D2FE",
    textAlign: "center",
    marginTop: 8,
  },

  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    marginTop: -50,
  },

  container: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },

  welcomeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
    marginBottom: 28,
  },

  inputContainer: {
    marginBottom: 18,
  },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    borderRadius: 16,

    paddingHorizontal: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,

    elevation: 2,
  },

  inputIcon: {
    marginRight: 8,
  },

  eyeIcon: {
    padding: 6,
  },

  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 15,
    color: "#111827",
  },

  btn: {
    backgroundColor: "#1E2875",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",

    marginTop: 10,

    shadowColor: "#1E2875",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 8,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#4F46E5",
    fontWeight: "700",
    marginLeft: 4,
  },

  footer: {
    marginTop: 40,
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
