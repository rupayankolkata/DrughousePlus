// src/screens/SplashScreen.js
import React, { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {
  /*useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 1800); // ~1.8s splash
    return () => clearTimeout(timer);
  }, [navigation]);*/

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          navigation.replace("Main"); // ✅ go to dashboard
        } else {
          navigation.replace("Login"); // ✅ go to login
        }
      } catch (err) {
        console.log("Error checking token", err);
        navigation.replace("Login");
      }
    };

    const timer = setTimeout(checkAuth, 1800); // delay for splash
    return () => clearTimeout(timer); // cleanup
  }, [navigation]);

  return (
    <LinearGradient colors={["#FFF", "#FFF"]} style={styles.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 200, height: 80 },
});
