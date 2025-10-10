import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../utils/api";
import axios from "axios";
import { useCart } from "../context/CartContext";

const promoBanners = [
  "https://drughouseplus.in/storage/app/public/yZxYwMWA88xUbWiRsbloTsBWa3H9fAA7zRwqsqd5.png",
  "https://drughouseplus.in/storage/app/public/EpBasrqfyRfmeEDDtWLLcNyJbkWXwLJOVgtCiYPF.png",
];
export default function DashboardScreen({ navigation }) {
  const [showPincode, setShowPincode] = useState(false);
  const [username, setUsername] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);

  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [hotMedicines, setHotMedicines] = useState([]);
  const [brands, setBrands] = useState([]);
  const [banners, setBanners] = useState([]);

  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUsername(user.name);
      }
    };
    loadUser();
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(
        "https://rupayaninfotech.com/drughouse/api/dashboard"
      );
      setCategories(res.data.categories);
      setMedicines(res.data.medicines);
      setHotMedicines(res.data.hot_medicines);
      setBrands(res.data.brands);
      setBanners(res.data.banners);
    } catch (err) {
      console.error("Dashboard API error", err);
    } finally {
      //setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setMenuVisible(false);
    navigation.replace("Login"); // back to login
  };

  //console.log(medicines);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        {/* First Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.rowLeft}>
            <Text style={styles.username}>Hello, {username || "Guest"}</Text>
          </TouchableOpacity>
          <View style={styles.rowRight}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Medicine", { screen: "MedicineList" })
              }
            >
              <Icon name="search-outline" size={24} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <Image
                source={require("../../assets/user.png")}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Dropdown Modal */}
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPressOut={() => setMenuVisible(false)}
          >
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("More", { screen: "Account" });
                }}
              >
                <Text style={styles.menuText}>My Account</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("More", { screen: "Orders" });
                }}
              >
                <Text style={styles.menuText}>My Orders</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Text style={[styles.menuText, { color: "red" }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Second Row - Pincode */}
        {showPincode && (
          <View style={styles.pincodeBox}>
            <TextInput
              placeholder="Enter Pincode"
              style={styles.pincodeInput}
            />
          </View>
        )}
      </View>

      {/* MAIN SCROLL */}
      <ScrollView>
        {/* Category text slider */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
        >
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() =>
                navigation.navigate("Medicine", {
                  screen: "MedicineList",
                  params: { categoryId: cat.id },
                })
              }
            >
              <Text style={styles.catText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 🔹 Image Slider just below category scroll */}
        <View style={styles.sliderWrapper}>
          <Swiper
            autoplay
            autoplayTimeout={3}
            showsPagination
            dotStyle={{ backgroundColor: "#ccc" }}
            activeDotStyle={{ backgroundColor: "#3193acff" }}
            style={{ borderRadius: 12 }}
          >
            {promoBanners.map((banner, index) => (
              <Image
                key={index}
                source={{ uri: banner }}
                style={styles.sliderImage}
                resizeMode="contain" // clean fill like Apollo
              />
            ))}
          </Swiper>
        </View>

        {/* Medicines Slider */}
        {/* Medicines */}
        <Text style={styles.sectionTitle}>Popular Medicines</Text>
        <View style={styles.medicineGrid}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
          >
            {medicines.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.medicineCard}
                onPress={() =>
                  navigation.navigate("ProductDetails", { product: item })
                }
              >
                <Image
                  source={{ uri: item.main_image }}
                  style={{
                    width: 150,
                    height: 150,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.medicineName}>{item.name}</Text>
                {/* Price Section */}
                <View style={{ marginVertical: 4 }}>
                  {/* Top row: Price + Discount */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.medicinePrice}>₹{item.price}</Text>
                    {item.mrp && item.mrp > item.price && (
                      <Text style={styles.discount}>
                        {" "}
                        {parseFloat(item.discount).toFixed(0)}%
                      </Text>
                    )}
                  </View>

                  {/* Bottom row: Crossed MRP (only if it exists and greater than price) */}
                  {item.mrp && item.mrp > item.price && (
                    <Text style={styles.mrp}>₹{item.mrp}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }} />

                {/* Add to cart button */}
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.main_image,
                      qty: 1,
                    })
                  }
                >
                  <Text style={styles.addToCartText}>+ Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Static Image */}
        <View style={styles.bannercard}>
          <Image
            source={require("../../assets/slider3.jpg")}
            style={styles.banner}
          />
        </View>

        {/* Category Grid */}
        <Text style={styles.sectionTitle}>Hot Products</Text>
        <View style={styles.medicineGrid}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.catScroll}
          >
            {hotMedicines.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.medicineCard}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate("ProductDetails", { product: item })
                }
              >
                <Image
                  source={{ uri: item.main_image }}
                  style={{
                    width: 150,
                    height: 150,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.medicineName}>{item.name}</Text>
                {/* Price Section */}
                <View style={{ marginVertical: 4 }}>
                  {/* Top row: Price + Discount */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.medicinePrice}>₹{item.price}</Text>
                    {item.mrp && item.mrp > item.price && (
                      <Text style={styles.discount}>
                        {" "}
                        {parseFloat(item.discount).toFixed(0)}%
                      </Text>
                    )}
                  </View>

                  {/* Bottom row: Crossed MRP (only if it exists and greater than price) */}
                  {item.mrp && item.mrp > item.price && (
                    <Text style={styles.mrp}>₹{item.mrp}</Text>
                  )}
                </View>

                <View style={{ flex: 1 }} />

                {/* Add to cart button */}
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() =>
                    addToCart({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      image: item.main_image,
                      qty: 1,
                    })
                  }
                >
                  <Text style={styles.addToCartText}>+ Add</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/*<View style={styles.grid}>
          {categoryGrid.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.gridImg}
              />
              <Text style={styles.gridText}>{item.title}</Text>
            </View>
          ))}
        </View>*/}

        {/* Chat Section */}
        {/*<View style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatText}>Need help? Chat with us!</Text>
          </View>
          <View style={styles.chatInputBox}>
            <TextInput
              placeholder="Type your message..."
              style={styles.chatInput}
            />
            <TouchableOpacity>
              <Icon name="send" size={22} color="blue" />
            </TouchableOpacity>
          </View>
        </View>*/}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#eef3f2ff",
    marginHorizontal: 15,
    marginTop: 25,
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  username: { fontSize: 16, fontWeight: "bold", marginRight: 5 },
  rowRight: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 15 },
  avatar: { width: 35, height: 35, borderRadius: 20 },
  pincodeBox: { marginTop: 8 },
  pincodeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 6,
  },

  catScroll: { padding: 5 },
  catText: { marginHorizontal: 10, fontSize: 16, fontWeight: "600" },

  medicineScroll: { marginVertical: 10 },
  medicineCard: { width: 100, alignItems: "center", marginRight: 15 },
  medicineImg: { width: 60, height: 60, marginBottom: 5 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
    padding: 15,
  },
  gridItem: {
    backgroundColor: "#fff",
    width: "22%", // 4 per row with spacing
    alignItems: "center",
    marginBottom: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    shadowColor: "#000",
    borderRadius: 12,
  },
  gridImg: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginBottom: 5,
  },
  gridText: {
    fontSize: 12,
    textAlign: "center",
  },

  bannercard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    margin: 15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 4,
  },
  banner: {
    width: "100%",
    height: 170,
    borderRadius: 10,
    resizeMode: "cover",
  },

  chatCard: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  chatHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  chatImg: { width: 40, height: 40, marginRight: 10 },
  chatText: { fontSize: 16, fontWeight: "500" },
  chatInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  chatInput: { flex: 1, padding: 6 },

  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },

  medicineGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    marginRight: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 160, // adjust card size
  },

  medicineImage: {
    width: 100, // must have width
    height: 100, // must have height
    marginBottom: 8,
  },

  medicineName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },

  medicinePrice: {
    fontSize: 14,
    color: "#009688",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 10,
  },

  sliderWrapper: {
    height: 200, // keeps banner rectangular (like Apollo)
    marginHorizontal: 15,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  addToCartBtn: {
    width: "100%", // full width of card
    backgroundColor: "#218595",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdown: {
    marginTop: 60,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5,
    paddingVertical: 8,
    width: 160,
  },
  menuItem: {
    padding: 12,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
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
});
