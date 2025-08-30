import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

export default function RegisterScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    branch: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.fullname || !formData.email || !formData.branch) {
      Alert.alert("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://examvaultserver.onrender.com/user/register`,
        formData
      );

      if (response.data.success) {
        navigation.navigate("Verification", { userData: formData });
      } else {
        Alert.alert(
          "Registration failed",
          response.data.message || "Please try again."
        );
      }
    } catch (error: any) {
      Alert.alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Please enter your details</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              value={formData.fullname}
              onChangeText={(value) => handleChange("fullname", value)}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              autoCapitalize="none"
              placeholderTextColor="#888"
              keyboardType="email-address"
            />

            <Picker
              selectedValue={formData.branch}
              style={styles.picker}
              onValueChange={(value) => handleChange("branch", value)}
            >
              <Picker.Item label="Select Branch" value="" />
              <Picker.Item label="CSE" value="CSE" />
              <Picker.Item label="ME" value="ME" />
              <Picker.Item label="EE" value="EE" />
              <Picker.Item label="CE" value="CE" />
            </Picker>

            <TouchableOpacity
              onPress={handleRegister}
              style={styles.registerButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.signUpText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  formWrapper: {
    width: "100%",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 6, color: "#000" },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    backgroundColor:"#F2F2F2",
    color:"black"
  },
  registerButton: {
    height: 48,
    backgroundColor: "#4C6FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", marginTop: 20, justifyContent: "center" },
  footerText: { color: "#666" },
  signUpText: { color: "#4C6FFF", fontWeight: "bold" },
});
