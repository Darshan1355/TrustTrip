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
import { Feather } from "@expo/vector-icons";
import api from "../config/api";
import { send_notification_to_user_welcome } from "../services/pushNotificationService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  username: string;
  [key: string]: unknown;
}

interface LoginResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface Props {
  navigation: {
    navigate: (screen: string) => void;
  };
  loginUser: (user: User) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LoginScreen({ navigation, loginUser }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): string | null => {
    if (!username.trim()) return "Please enter your username.";
    if (!password) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  };

  // ── Login handler ───────────────────────────────────────────────────────────

  const login = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Missing fields", error);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<LoginResponse>("/login", {
        username: username.trim(),
        password,
      });
      const data = res.data;

      if (data?.success) {
        const storageKey = `firstLogin_${data.user.id}`;
        const hasLoggedInBefore = await AsyncStorage.getItem(storageKey);
        const isFirstLogin = !hasLoggedInBefore;

        await AsyncStorage.setItem("user", JSON.stringify(data.user));

        if (isFirstLogin) {
          await AsyncStorage.setItem(storageKey, "true");
          send_notification_to_user_welcome(data.user.id).catch((err: unknown) =>
            console.warn("Welcome notification failed:", err)
          );
        }

        loginUser(data.user);
      } else {
        Alert.alert("Login Failed", data?.message ?? "Invalid username or password.");
      }
    } catch (err: unknown) {
      console.error("LOGIN ERROR:", err);

      const axiosErr = err as { response?: { data?: unknown }; message?: string };
      const serverMsg = axiosErr?.response?.data ?? axiosErr?.message ?? "Something went wrong.";

      Alert.alert(
        "Error",
        typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: "#1E2875" }}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
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

          {/* ── Card ───────────────────────────────────────────────────────── */}
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            style={styles.card}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to access your secure travel dashboard.
            </Text>

            {/* Username */}
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
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
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
                  onSubmitEditing={login}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeIcon}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login button */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={login}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Register link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerLink}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to our Terms & Privacy Policy.
              </Text>
            </View>
          </ScrollView>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Header / branding
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

  // Card
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
    paddingBottom: 40,
  },

  // Welcome text
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

  // Inputs
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
    marginBottom: 8,     // ← Fix: username label now has consistent spacing
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 8,     // aligns with labelRow pattern
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
    shadowOffset: { width: 0, height: 2 },
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

  // Button
  btn: {
    backgroundColor: "#1E2875",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1E2875",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  // Register
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

  // Footer — now actually used
  footer: {
    marginTop: 32,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 18,
  },
});
