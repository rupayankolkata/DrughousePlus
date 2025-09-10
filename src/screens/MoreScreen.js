// src/screens/MoreScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function MoreScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>More Options</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Orders")}
      >
        <Text style={styles.buttonText}>My Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Account")}
      >
        <Text style={styles.buttonText}>My Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("About")}
      >
        <Text style={styles.buttonText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Terms")}
      >
        <Text style={styles.buttonText}>Terms & Conditions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#f8f8f8",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  button: {
    backgroundColor: "#3193ac",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, textAlign: "center" },
});
