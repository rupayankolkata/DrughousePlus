// src/navigation/AppNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../screens/DashboardScreen";
import MedicineListScreen from "../screens/MedicineListScreen";
import CartScreen from "../screens/CartScreen";
import MoreScreen from "../screens/MoreScreen";
/*import AccountScreen from "../screens/AccountScreen";
import OrdersScreen from "../screens/OrdersScreen";*/
import Icon from "react-native-vector-icons/Ionicons";
import CartStack from "./CartStack";
import MoreStack from "./MoreStack";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useCart } from "../context/CartContext";
import HomeStack from "./HomeStack";
import MedicineStack from "./MedicineStack";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((s, it) => s + it.qty, 0);

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true, // ✅ show label
          tabBarActiveTintColor: "#218595", // active color
          tabBarInactiveTintColor: "gray", // inactive color
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={26} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartStack}
          options={{
            tabBarIcon: ({ color }) => (
              <View>
                <Icon name="cart" size={24} color={color} />
                {cartCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      right: -8,
                      top: -4,
                      backgroundColor: "red",
                      borderRadius: 8,
                      paddingHorizontal: 5,
                      minWidth: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>
                      {cartCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Medicine"
          component={MedicineStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="medkit" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="More"
          component={MoreStack}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="ellipsis-horizontal" size={26} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://wa.me/9123921556")}
        style={{
          position: "absolute",
          bottom: 150, // just above bottom tab
          right: 20,
          backgroundColor: "#25D366",
          padding: 15,
          borderRadius: 50,
          elevation: 5,
        }}
      >
        <Icon name="logo-whatsapp" size={20} color="#fff" />
      </TouchableOpacity>
    </>
  );
}
