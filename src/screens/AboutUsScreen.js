// src/screens/AboutUsScreen.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>About Us</Text>
      <Text style={styles.text}>
        We are a leading pharmacy app committed to delivering medicines quickly
        and affordably. Our goal is to make healthcare accessible and convenient
        for everyone.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#3193ac",
  },
  text: { fontSize: 16, lineHeight: 22, textAlign: "justify" },
});
