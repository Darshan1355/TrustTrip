import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import api from "../config/api";

export default function RegisterScreen({ navigation }: any) {

const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [name,setName]=useState("")
const [mob,setMobile]=useState("")
const [address,setAddress]=useState("")
const [nationality,setNationality]=useState("")
const [emergency_contact,setEmergencyContact]=useState("")

const register = async () => {

const res = await api.post("/register", {
username,
password,
name,
mob,
address,
nationality,
emergency_contact
});

const data = res.data;

if(data.success){
alert("Registration successful")
navigation.replace("Login")
}else{
alert("Registration failed")
}

}



return (

<KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
>

<TouchableWithoutFeedback onPress={Keyboard.dismiss}>

<ScrollView
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
>

  {/* Hero header */}
  <View style={styles.hero}>
    <View style={styles.logoCircle}>
      <Text style={styles.logoText}>🌍</Text>
    </View>

    <Text style={styles.heroTitle}>TrustTrip</Text>

    <Text style={styles.heroSubtitle}>
      Start your journey with confidence
    </Text>
  </View>

  {/* Form card */}
  <View style={styles.formCard}>

    <Text style={styles.title}>Create Account</Text>
    <View style={styles.titleUnderline} />

    {/* Identity details */}
    <Text style={styles.sectionLabel}>IDENTITY DETAILS</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Full Name</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>👤</Text>
        <TextInput
          placeholder="Johnathan Doe"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onChangeText={setName}
        />
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Username</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>@</Text>
        <TextInput
          placeholder="jdoe_travels"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onChangeText={setUsername}
        />
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>🔒</Text>
        <TextInput
          placeholder="••••••••"
          style={styles.input}
          secureTextEntry
          placeholderTextColor="#9CA3AF"
          onChangeText={setPassword}
        />
      </View>
    </View>

    <View style={styles.divider} />

    {/* Contact info */}
    <Text style={styles.sectionLabel}>CONTACT INFO</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Mobile Number</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>📞</Text>
        <TextInput
          placeholder="+1 (555) 000-0000"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
          onChangeText={setMobile}
        />
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Nationality</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>🌐</Text>
        <TextInput
          placeholder="Select your country"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onChangeText={setNationality}
        />
        <Text style={styles.chevron}>⌄</Text>
      </View>
    </View>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Home Address</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>📍</Text>
        <TextInput
          placeholder="Street, City, State, Zip"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onChangeText={setAddress}
        />
      </View>
    </View>

    <View style={styles.divider} />

    {/* Safety network */}
    <Text style={styles.sectionLabel}>SAFETY NETWORK</Text>

    <View style={styles.inputGroup}>
      <Text style={styles.label}>Emergency Contact</Text>
      <View style={styles.inputRow}>
        <Text style={styles.inputIcon}>🆘</Text>
        <TextInput
          placeholder="Name & Phone Number"
          style={styles.input}
          placeholderTextColor="#9CA3AF"
          onChangeText={setEmergencyContact}
        />
      </View>
      <Text style={styles.helperText}>
        This person will be notified only if you trigger an SOS alert.
      </Text>
    </View>

    <TouchableOpacity style={styles.btn} onPress={register}>
      <Text style={styles.btnText}>Register</Text>
      <Text style={styles.btnArrow}>→</Text>
    </TouchableOpacity>

    <View style={styles.loginContainer}>
      <Text style={styles.loginText}>
        Already have an account?
      </Text>

      <TouchableOpacity
        onPress={()=>navigation.navigate("Login")}
      >
        <Text style={styles.loginLink}>
          Login
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.secureBadge}>
      <Text style={styles.secureBadgeText}>✅  SECURE &amp; ENCRYPTED</Text>
    </View>

  </View>

  <View style={styles.footer}>
    <Text style={styles.footerText}>
      By registering, you agree to TrustTrip's Terms of Service{"\n"}
      and Privacy Policy.{"\n"}
      Your location and data are never shared without your explicit{"\n"}
      consent.
    </Text>
  </View>

</ScrollView>

</TouchableWithoutFeedback>

</KeyboardAvoidingView>

);

}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8FAFC",
    paddingBottom: 30,
  },

  /* Hero */
  hero: {
    backgroundColor: "#0B1D51",
    alignItems: "center",
    paddingTop: 70,
    paddingBottom: 70,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  logoText: {
    fontSize: 30,
  },

  heroTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  heroSubtitle: {
    fontSize: 13,
    color: "#C7D2FE",
  },

  /* Form card */
  formCard: {
    backgroundColor: "#FFFFFF",
    marginTop: -32,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 22,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  titleUnderline: {
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#16A34A",
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 18,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
  },

  inputIcon: {
    fontSize: 15,
    marginRight: 10,
    color: "#9CA3AF",
  },

  chevron: {
    fontSize: 16,
    color: "#9CA3AF",
    marginLeft: 6,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },

  helperText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
  },

  btn: {
    flexDirection: "row",
    backgroundColor: "#1B2559",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 18,

    shadowColor: "#1B2559",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  btnArrow: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },

  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },

  loginLink: {
    color: "#4F46E5",
    fontWeight: "700",
    marginLeft: 5,
  },

  secureBadge: {
    alignSelf: "center",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },

  secureBadgeText: {
    color: "#166534",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  footer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 24,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});
