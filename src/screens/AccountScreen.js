import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    fetchAccountInfo();
  }, []);

  const fetchAccountInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) return;
      const parsedUser = JSON.parse(storedUser);

      const res = await axios.post(
        "https://rupayaninfotech.com/drughouse/api/account-info",
        {
          user_id: parsedUser.id,
        }
      );

      setUser(res.data.user);
      setAddresses(res.data.addresses);
    } catch (error) {
      console.log("Error fetching account:", error.message);
    }
  };

  const handleAddAddress = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const parsedUser = JSON.parse(storedUser);

      if (!form.address || !form.city || !form.state || !form.zip) {
        Alert.alert("Error", "Please fill all fields");
        return;
      }

      const newAddress = {
        user_id: parsedUser.id,
        ...form,
      };

      const res = await axios.post(
        "https://rupayaninfotech.com/drughouse/api/add-address",
        newAddress
      );

      Alert.alert("Success", "Address added successfully!");
      setAddresses([...addresses, res.data.address]);
      setModalVisible(false);
      setForm({ address: "", city: "", state: "", zip: "" });
    } catch (error) {
      console.log("Error adding address:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.card}>
        <Text style={styles.title}>My Account</Text>
        {user ? (
          <>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Phone: {user.phone ?? "N/A"}</Text>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>

      {/* Saved Addresses */}
      <View style={styles.card}>
        <Text style={styles.title}>Addresses</Text>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Text>
              {item.address}, {item.city}, {item.state} - {item.zip}
            </Text>
          )}
        />
      </View>

      {/* Add Address Button */}
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      {/* Add Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Add New Address</Text>

            <TextInput
              placeholder="Address"
              style={styles.input}
              value={form.address}
              onChangeText={(text) => setForm({ ...form, address: text })}
            />
            <TextInput
              placeholder="City"
              style={styles.input}
              value={form.city}
              onChangeText={(text) => setForm({ ...form, city: text })}
            />
            <TextInput
              placeholder="State"
              style={styles.input}
              value={form.state}
              onChangeText={(text) => setForm({ ...form, state: text })}
            />
            <TextInput
              placeholder="Zip Code"
              style={styles.input}
              value={form.zip}
              onChangeText={(text) => setForm({ ...form, zip: text })}
              keyboardType="numeric"
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 5 }]}
                onPress={handleAddAddress}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1, backgroundColor: "gray" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f8f8" },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  button: { backgroundColor: "#3193ac", padding: 12, borderRadius: 6 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
});
