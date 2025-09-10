// src/components/Header.js
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Header({ userName, onPincodeCheck, onAccountPress, onOrdersPress }) {
  const [showPincode, setShowPincode] = useState(false);
  const [pincode, setPincode] = useState("");

  return (
    <View style={styles.header}>
      {/* Row 1 */}
      <View style={styles.row}>
        <View style={styles.leftRow}>
          <TouchableOpacity onPress={onAccountPress}>
            <Text style={styles.userName}>{userName}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPincode(!showPincode)}>
            <Icon name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.rightRow}>
          <TouchableOpacity>
            <Icon name="notifications-outline" size={22} color="#000" style={{ marginRight: 15 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onAccountPress}>
            <Image source={require("../../assets/user.jpg")} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pincode input */}
      {showPincode && (
        <View style={styles.pincodeBox}>
          <TextInput
            style={styles.pincodeInput}
            placeholder="Enter pincode"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />
          <TouchableOpacity onPress={() => onPincodeCheck(pincode)}>
            <Icon name="search-outline" size={20} color="#fff" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: "#fff", padding: 10, borderBottomWidth: 1, borderColor: "#eee" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftRow: { flexDirection: "row", alignItems: "center" },
  rightRow: { flexDirection: "row", alignItems: "center" },
  userName: { fontSize: 16, fontWeight: "600", marginRight: 5 },
  avatar: { width: 32, height: 32, borderRadius: 16 },
  pincodeBox: { flexDirection: "row", marginTop: 8, alignItems: "center" },
  pincodeInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 },
  searchIcon: { backgroundColor: "#1E88E5", padding: 8, borderRadius: 8, marginLeft: 5 },
});