import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ThankYouScreen({ route, navigation }) {
  const { orderId } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Thank You!</Text>
      <Text style={styles.message}>
        Your order has been placed successfully.
      </Text>
      {orderId && <Text style={styles.order}>Order ID: #{orderId}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home", { screen: "Dashboard" })} // or "MainTabs"
      >
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3193ac",
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: "#333",
    marginBottom: 5,
  },
  order: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#3193ac",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
