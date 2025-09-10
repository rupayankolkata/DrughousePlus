// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert, 
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-swiper";
import API from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async() => {
    // 🚀 For now, just redirect to Dashboard
    //navigation.replace("MainTabs");
    setLoading(true);
    try {
      const response = await API.post("/login", { email, password });

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        navigation.replace("Main");
      } else {
        Alert.alert("Error", "Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = () => {
    alert(`Login with: ${id}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Image Slider */}
      <View style={styles.sliderContainer}>
        <Swiper
          autoplay
          autoplayTimeout={3}
          showsPagination={true}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          <Image
            source={require("../../assets/slider1.jpg")}
            style={styles.slideImage}
            resizeMode="cover"
          />
          <Image
            source={require("../../assets/slider2.jpg")}
            style={styles.slideImage}
            resizeMode="cover"
          />
          <Image
            source={require("../../assets/slider3.jpg")}
            style={styles.slideImage}
            resizeMode="cover"
          />
        </Swiper>
      </View>

      {/* Logo */}

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email or Mobile number"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/*<TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Main")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>*/}

        {/*<TouchableOpacity
          style={styles.button}
          onPress={() => handleLogin}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>*/}

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: "#ccc" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  sliderContainer: {
    height: 180,
    width: width - 40,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  slideImage: { width: "100%", height: "100%" },
  dot: {
    backgroundColor: "rgba(255,255,255,0.5)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: "#1E88E5",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  logo: { width: 200, height: 200,  marginBottom: 20 },
  form: { width: "100%" },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  button: {
    backgroundColor: "#1E88E5",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: "#1E88E5", marginTop: 14, fontSize: 14 },
});
