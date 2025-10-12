import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, otp } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://rupayaninfotech.com/drughouse/api/forgot-password/reset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            password,
            password_confirmation: confirmPassword,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.status) {
        Alert.alert("Success", "Password reset successful!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", data.message || "Reset failed");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Reset Password</Text>
      <TextInput
        placeholder="New Password"
        placeholderTextColor="#000"
        color="#000"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#000"
        value={confirmPassword}
        color="#000"
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={handleResetPassword}
        style={{ backgroundColor: "#dc3545", padding: 15, borderRadius: 8 }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center" }}>
            Reset Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
