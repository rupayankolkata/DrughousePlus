import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const userData = await AsyncStorage.getItem("user"); // 👈 stored at login
      if (!userData) {
        console.log("No user found in storage");
        setLoading(false);
        return;
      }

      const parsedUser = JSON.parse(userData);

      const response = await axios.get(
        "https://rupayaninfotech.com/drughouse/api/orders",
        {
          params: { user_id: parsedUser.id }, // 👈 send user_id dynamically
        }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        console.log("API error:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>Order No: {item.order_no}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Amount: ₹{item.amount.toFixed(2)}</Text>
      <Text>Date: {item.date}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // 👇 implement invoice download/view
          console.log("Download Invoice", item.id);
        }}
      >
        <Text style={styles.buttonText}>Download Invoice</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3193ac" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f8f8" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  button: {
    marginTop: 8,
    backgroundColor: "#3193ac",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
});
