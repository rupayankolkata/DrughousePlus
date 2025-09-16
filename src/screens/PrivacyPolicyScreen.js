// src/screens/TermsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function PrivacyPolicyScreen() {
  const [policy, setPolicy] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await fetch(
        "https://drughouseplus.in/api/privacy-policy"
      );
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setPolicy(data.desc);
      }
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Privacy Policy</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3193ac" />
      ) : (
        <Text style={styles.text}>{policy}</Text>
      )}
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
