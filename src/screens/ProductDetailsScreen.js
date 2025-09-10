// src/screens/ProductDetailsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { useCart } from "../context/CartContext";
import Icon from "react-native-vector-icons/Ionicons";

const TOP = Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0;

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params; // coming from navigation
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: Number(product.price), // convert to number
      image: product.main_image, // consistent field
      qty: 1,
    };
    addToCart(cartItem);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: TOP, backgroundColor: "#3193ac" }} />
      {/* header card like CartScreen */}
      <View style={styles.headerCard}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 8 }}
          >
            <Icon name="chevron-back" size={22} color="#0A3D4A" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Product Details</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              {product?.name || "—"}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={styles.container}>
        <Image
          source={{
            uri: product.main_image,
          }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
            {/* Show discounted price */}
            <Text style={styles.medicinePrice}>₹{product.price}</Text>

            {/* If MRP exists and greater than price, show strike + discount */}
            {product.mrp && product.mrp > product.price && (
              <>
                <Text style={styles.mrp}> ₹{product.mrp}</Text>
                <Text style={styles.discount}>
                  {" "}
                  {parseFloat(product.discount).toFixed(0)}%
                </Text>
              </>
            )}
          </View>
          <Text style={styles.desc}>
            {product.description || "No description available."}
          </Text>

          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartTxt}>+ Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 20 },
  image: { width: "100%", height: 280, backgroundColor: "#f2f2f2" },
  infoBox: { padding: 16 },
  name: { fontSize: 20, fontWeight: "800", color: "#0A3D4A" },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A7EA4",
    marginVertical: 8,
  },
  desc: { fontSize: 15, color: "#555", marginVertical: 12, lineHeight: 20 },
  cartBtn: {
    backgroundColor: "#0A7EA4",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  cartTxt: { color: "#fff", fontWeight: "900", fontSize: 16 },
  headerCard: {
    backgroundColor: "#fff",
    margin: 12,
    marginTop: 30,
    padding: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#0A3D4A" },
  headerSub: { color: "#63828b", marginTop: 2, maxWidth: 260 },
  mrp: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
    textDecorationLine: "line-through",
    marginLeft: 6,
  },
  discount: {
    fontSize: 14,
    color: "green",
    marginLeft: 5,
    marginTop: 5,
    fontWeight: "bold",
  },
  medicinePrice: {
    fontSize: 14,
    color: "#009688",
    marginTop: 4,
  },
});
