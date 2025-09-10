import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api"; // axios instance
import Icon from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext";

export default function CheckoutScreen({ navigation }) {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    const fetchAddresses = async () => {
      const userStr = await AsyncStorage.getItem("user");
      const user = JSON.parse(userStr);
      try {
        const res = await API.get(`/addresses/${user.id}`);
        setAddresses(res.data);
      } catch (e) {
        console.log(e);
      }

      // Pre-fill user details for new address form
      setForm((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }));
    };
    fetchAddresses();
  }, []);

  const subtotal = cartItems.reduce(
    (s, it) => s + Number(it.price) * Number(it.qty ?? it.quantity ?? 1),
    0
  );
  const delivery = 0;
  const total = subtotal + delivery;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      const user = JSON.parse(userStr);
      const cartStr = await AsyncStorage.getItem("cart");
      const cart = JSON.parse(cartStr) || [];

      if (!cart.length) {
        Alert.alert("Error", "Your cart is empty.");
        return;
      }

      let addressPayload = {};

      if (selectedAddressId === "new") {
        // Use entered form values
        addressPayload = { ...form };
      } else {
        // Find selected existing address and send its fields
        const selectedAddress = addresses.find(
          (a) => a.id === selectedAddressId
        );
        if (!selectedAddress) {
          Alert.alert("Error", "Please select a valid address.");
          setLoading(false);
          return;
        }

        addressPayload = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          pincode: selectedAddress.zip,
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
        };
      }

      const payload = {
        ...addressPayload,
        selected_address_id: selectedAddressId || "new",
        cart,
        user_id: user.id,
      };

      const res = await API.post("/checkout/place-order", payload);

      Alert.alert("Success", "Order placed successfully!", [
        {
          text: "OK",
          onPress: () => {
            handleOrderSuccess(res.data.order_id);
          },
        },
      ]);
      await AsyncStorage.removeItem("cart");
      clearCart();
      navigation.navigate("Cart"); // or Cart screen
    } catch (err) {
      console.log(err);
      Alert.alert("Error", err.response?.data?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function outside
  const handleOrderSuccess = async (orderId) => {
    // Clear cart
    await AsyncStorage.removeItem("cart");

    // Navigate to Thank You screen
    navigation.replace("ThankYou", { orderId });
  };

  const renderAddress = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedAddressId(item.id)}
      style={{
        padding: 12,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: selectedAddressId === item.id ? "#3193ac" : "#ddd",
        borderRadius: 8,
      }}
    >
      <Text>{item.address}</Text>
      <Text>
        {item.city}, {item.state} - {item.zip}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.headerCard}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 8 }}
        >
          <Icon name="chevron-back" size={22} color="#0A3D4A" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.headerSub}>Deliver to</Text>
        </View>
      </View>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(it) => String(it.id)}
          renderItem={({ item }) => (
            <View style={styles.summaryRow}>
              <Text style={{ flex: 1 }}>
                {item.name} x {item.qty ?? item.quantity ?? 1}
              </Text>
              <Text>
                ₹
                {(
                  Number(item.price) * (item.qty ?? item.quantity ?? 1)
                ).toFixed(2)}
              </Text>
            </View>
          )}
        />
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, { marginTop: 8 }]}>
          <Text style={{ fontWeight: "800" }}>Total</Text>
          <Text style={{ fontWeight: "800" }}>₹{total.toFixed(2)}</Text>
        </View>
      </View>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAddress}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Checkout
            </Text>

            {/* Saved Addresses */}
            <Text style={{ fontSize: 16, marginBottom: 8 }}>
              Saved Addresses
            </Text>

            {/* If New Address Selected */}
            {selectedAddressId === "new" && (
              <View>
                <TextInput
                  placeholder="Full Name"
                  value={form.name}
                  editable={false}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Email"
                  value={form.email}
                  editable={false}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Phone"
                  value={form.phone}
                  editable={false} 
                  style={styles.input}
                />
                <TextInput
                  placeholder="Pincode"
                  value={form.pincode}
                  onChangeText={(t) => setForm({ ...form, pincode: t })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Address"
                  value={form.address}
                  onChangeText={(t) => setForm({ ...form, address: t })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="City"
                  value={form.city}
                  onChangeText={(t) => setForm({ ...form, city: t })}
                  style={styles.input}
                />
                <TextInput
                  placeholder="State"
                  value={form.state}
                  onChangeText={(t) => setForm({ ...form, state: t })}
                  style={styles.input}
                />
              </View>
            )}

            {/* New Address Option */}
            <TouchableOpacity
              onPress={() => setSelectedAddressId("new")}
              style={{
                padding: 12,
                marginVertical: 6,
                borderWidth: 1,
                borderColor: selectedAddressId === "new" ? "#3193ac" : "#ddd",
                borderRadius: 8,
              }}
            >
              <Text>+ Add New Address</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          <View style={{ padding: 16 }}>
            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={{
                backgroundColor: "#3193ac",
                padding: 14,
                borderRadius: 8,
                alignItems: "center",
                marginTop: 20,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Place Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        }
      />
    </>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginVertical: 6,
  },
  headerCard: {
    backgroundColor: "#fff",
    margin: 12,
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0A3D4A" },
  headerSub: { color: "#63828b", marginTop: 2 },

  summary: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: "800", marginBottom: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.3,
    borderColor: "#e8eef0",
  },
};
