// src/screens/TermsScreen.js
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Terms & Conditions</Text>
      <Text style={styles.text}>
        By using this app, you agree to our terms and conditions. All orders are
        subject to availability and prescription requirements. Please ensure
        that all information provided is accurate. We reserve the right to
        update our policies at any time.
      </Text>
    </ScrollView>
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
