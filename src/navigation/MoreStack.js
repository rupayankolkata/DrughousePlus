// src/navigation/MoreStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MoreScreen from "../screens/MoreScreen";
import OrdersScreen from "../screens/OrdersScreen";
import AccountScreen from "../screens/AccountScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import TermsScreen from "../screens/TermsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator>
      {/* More main – hide header */}
      <Stack.Screen
        name="MoreMain"
        component={MoreScreen}
        options={{ headerShown: false }}
      />

      {/* Orders with title */}
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "My Orders",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#3193ac" },
          headerTintColor: "#fff",
        }}
      />

      {/* Account with title */}
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "My Account",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#3193ac" },
          headerTintColor: "#fff",
        }}
      />

      {/* About us with title */}
      <Stack.Screen
        name="About"
        component={AboutUsScreen}
        options={{
          title: "About Us",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#3193ac" },
          headerTintColor: "#fff",
        }}
      />

      {/* Terms with title */}
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: "Terms and Conditions",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#3193ac" },
          headerTintColor: "#fff",
        }}
      />
      {/* Terms with title */}
      <Stack.Screen
        name="Privacy"
        component={PrivacyPolicyScreen}
        options={{
          title: "Privacy Policy",
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#3193ac" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}
