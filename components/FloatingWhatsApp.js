// components/FloatingWhatsApp.js
import React from "react";
import {
  TouchableOpacity,
  Linking,
  StyleSheet,
  Image,
  View,
} from "react-native";

export default function FloatingWhatsApp() {
  const openWhatsApp = () => {
    const phone = "91XXXXXXXXXX"; // 👈 replace with your WhatsApp number (with country code)
    const message = "Hello, I need support with Drughouse Plus!";
    Linking.openURL(
      `whatsapp://send?phone=${phone}&text=${encodeURIComponent(message)}`
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openWhatsApp} style={styles.button}>
        <Image
          source={require("../assets/WhatsApp_icon.png")} // 👈 add whatsapp.png in assets folder
          style={{ width: 70, height: 70 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100, // 👈 just above bottom tab
    right: 20,
    zIndex: 999,
  },
  button: {
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
});
