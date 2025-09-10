// src/navigation/MedicineStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MedicineListScreen from "../screens/MedicineListScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";

const Stack = createNativeStackNavigator();

export default function MedicineStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MedicineList" component={MedicineListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
}
