import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

export default function OtpVerifyScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://rupayaninfotech.com/drughouse/api/forgot-password/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.status) {
        Alert.alert("Success", "OTP verified", [
          {
            text: "OK",
            onPress: () => navigation.navigate("ResetPassword", { email, otp }),
          },
        ]);
      } else {
        Alert.alert("Error", data.message || "Invalid OTP");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Verify OTP</Text>
      <TextInput
        placeholder="Enter 6-digit OTP"
        placeholderTextColor="#000"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={handleVerifyOtp}
        style={{ backgroundColor: "#28a745", padding: 15, borderRadius: 8 }}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", textAlign: "center" }}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
