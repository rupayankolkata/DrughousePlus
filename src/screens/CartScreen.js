// src/screens/CartScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);
  //const delivery = subtotal > 499 ? 0 : 39;
  const total = subtotal; /*+ delivery*/

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Image
        source={{
          uri: item.image
            ? item.image
            : "https://via.placeholder.com/100x80?text=No+Image",
        }}
        style={styles.img}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>

        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, Math.max(1, item.qty - 1))}
          >
            <Icon name="remove" size={18} color="#0A7EA4" />
          </TouchableOpacity>
          <Text style={styles.qtyTxt}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => updateQuantity(item.id, item.qty + 1)}
          >
            <Icon name="add" size={18} color="#0A7EA4" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removeFromCart(item.id)}
          >
            <Icon name="trash-outline" size={18} color="#b23b3b" />
            <Text style={styles.removeTxt}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <Text style={styles.headerSub}>{cartItems.length} items</Text>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 140 }}
        data={cartItems}
        keyExtractor={(it) => it.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <Text
            style={{ textAlign: "center", marginTop: 40, color: "#52727c" }}
          >
            Your cart is empty
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* sticky checkout bar */}
      {cartItems.length > 0 && (
        <View style={styles.checkoutBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.totalTxt}>Total: ₹{total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Checkout")}
            style={styles.checkoutBtn}
          >
            <Text style={styles.checkoutTxt}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const CARD = 14;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  headerCard: {
    backgroundColor: "#fff",
    margin: 12,
    marginTop: 30,
    padding: 14,
    borderRadius: CARD,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#0A3D4A" },
  headerSub: { color: "#63828b", marginTop: 2 },

  row: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    borderRadius: CARD,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  img: { width: 90, height: 80, borderRadius: 10, marginRight: 10 },
  title: { fontWeight: "700", color: "#0A3D4A" },
  price: { marginTop: 2, color: "#0A7EA4", fontWeight: "800" },

  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bfe6ef",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyTxt: {
    width: 34,
    textAlign: "center",
    fontWeight: "700",
    color: "#0A3D4A",
  },
  removeBtn: { flexDirection: "row", alignItems: "center", marginLeft: "auto" },
  removeTxt: { marginLeft: 6, color: "#b23b3b", fontWeight: "700" },

  checkoutBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  totalTxt: { fontSize: 18, fontWeight: "900", color: "#0A3D4A" },
  subTxt: { color: "#668a94" },
  checkoutBtn: {
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
  },
  checkoutTxt: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
