import React, { useEffect } from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import CheckoutScreen from "./src/screens/CheckoutScreen";
import { CartProvider } from "./src/context/CartContext";
import OtpVerifyScreen from "./src/screens/OtpVerifyScreen";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#3193acff" }}>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Splash first */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            {/* Then login */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
            />
            {/* Then dashboard (tabs) */}
            <Stack.Screen name="Main" component={AppNavigator} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </View>
  );
}
