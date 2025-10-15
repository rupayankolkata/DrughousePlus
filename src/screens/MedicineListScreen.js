// src/screens/MedicineListScreen.js
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function MedicineListScreen({ route, navigation }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(route.params?.categoryId || 0); // use ID, default All
  const [categories, setCategories] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const isFilterApplied =
    !!query || (category && category !== 0) || !!priceMin || !!priceMax;

  const { addToCart } = useCart();

  useEffect(() => {
    if (route.params?.categoryId) {
      setCategory(route.params.categoryId);
      setPriceMin("");
      setPriceMax("");
    }
  }, [route.params?.categoryId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setPage(1);
    setData([]);
    fetchMedicines(1, true);
  }, [category, priceMin, priceMax]);

  useEffect(() => {
    if (page > 1) fetchMedicines(page);
  }, [page]);

  const fetchMedicines = async (pageToLoad = 1, replace = false) => {
    console.log(category);
    console.log(priceMin);
    console.log(priceMax);
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await axios.get(
        "https://rupayaninfotech.com/drughouse/api/medicines",
        {
          params: {
            page: pageToLoad,
            search: query || undefined,
            category_id: category && category !== 0 ? category : undefined,
            price_min: priceMin || undefined,
            price_max: priceMax || undefined,
          },
        }
      );

      const newData = res.data?.data || [];
      if (replace) {
        setData(newData);
      } else {
        setData((prev) => [...prev, ...newData]);
      }

      // If API supports pagination meta, you can check that instead
      if (newData.length === 0) setHasMore(false);
    } catch (err) {
      console.error("Error fetching medicines:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://rupayaninfotech.com/drughouse/api/categories"
      );
      if (Array.isArray(res.data)) {
        const uniqueData = res.data.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
        );
        setCategories([{ id: 0, name: "All" }, ...uniqueData]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err.message);
    }
  };

  const resetFilters = () => {
    setQuery("");
    setCategory(0);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
    setData([]);
    setHasMore(true);
    fetchMedicines(1, true);
  };

  const onEndReached = useCallback(() => {
    if (!loading && hasMore) {
      setPage((p) => p + 1);
    }
  }, [loading, hasMore]);

  const renderItem = ({ item }) => {
    const manufacturerName =
      typeof item.manufacturer === "object"
        ? item.manufacturer?.name
        : item.manufacturer || "Unknown";

    const categoryName =
      typeof item.category === "object"
        ? item.category?.name
        : item.category || "";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("ProductDetails", { product: item })}
      >
        <Image
          source={{ uri: item.main_image || item.image }}
          style={styles.cardImg}
        />

        {/* Card Body */}
        <View style={styles.cardBody}>
          {/* Upper content (name, manufacturer, price, etc.) */}
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.name}
            </Text>

            {!!manufacturerName && (
              <Text style={styles.cardSub}>{manufacturerName}</Text>
            )}

            <View style={{ marginVertical: 4 }}>
              {/* Row 1: Price + Discount */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.cardPrice}>₹{item.price}</Text>
                {item.mrp && item.mrp > item.price && (
                  <Text style={styles.discount}>
                    {"  "}
                    {parseFloat(item.discount).toFixed(0)}%
                  </Text>
                )}
              </View>

              {/* Row 2: MRP (strikethrough) */}
              {item.mrp && item.mrp > item.price && (
                <Text style={styles.mrp}>₹{item.mrp}</Text>
              )}
            </View>

            {!!categoryName && (
              <Text style={{ fontSize: 12, color: "#888" }}>
                {categoryName}
              </Text>
            )}
          </View>

          {/* Add Button pinned at bottom */}
          <TouchableOpacity
            onPress={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.main_image,
                qty: 1,
              })
            }
            style={styles.addBtn}
          >
            <Icon name="add-outline" size={18} color="#fff" />
            <Text style={styles.addTxt}>ADD</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      {loading && data.length === 0 && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0A7EA4" />
        </View>
      )}
      {/* Header card */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Medicines</Text>
        <Text style={styles.headerSub}>
          Explore categories, bestsellers & offers
        </Text>

        <View style={styles.searchRow}>
          <Icon name="search-outline" size={18} color="#5d7d86" />
          <TextInput
            placeholder="Search medicine or brand"
            placeholderTextColor="#000"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => {
              setPage(1);
              setData([]);
              fetchMedicines(1, true);
            }}
          />
          {!!query && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setPage(1);
                setData([]);
                fetchMedicines(1, true);
              }}
            >
              <Icon name="close-circle" size={18} color="#8aa4ad" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.chip}
            onPress={() => setShowCatModal(true)}
          >
            <Icon name="funnel-outline" size={14} color="#0A7EA4" />
            <Text style={styles.chipTxt}>
              {categories.find((c) => c.id === category)?.name || "All"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chip}
            onPress={() => setShowPriceModal(true)}
          >
            <Icon name="cash-outline" size={14} color="#0A7EA4" />
            <Text style={styles.chipTxt}>
              Price {priceMin || "min"}–{priceMax || "max"}
            </Text>
          </TouchableOpacity>
          {isFilterApplied && (
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid list */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 90 }}
        data={data}
        keyExtractor={(it) => it.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        onEndReachedThreshold={0.3}
        onEndReached={onEndReached}
        showsVerticalScrollIndicator={false}
      />

      {/* Category Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showCatModal}
        onRequestClose={() => setShowCatModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowCatModal(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id.toString()}
                  style={[
                    styles.modalChip,
                    c.id === category && {
                      backgroundColor: "#e7f5f9",
                      borderColor: "#0A7EA4",
                    },
                  ]}
                  onPress={() => {
                    setCategory(c.id);
                    setShowCatModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalChipTxt,
                      c.id === category && {
                        color: "#0A7EA4",
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Price Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showPriceModal}
        onRequestClose={() => setShowPriceModal(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setShowPriceModal(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Price range</Text>
            <View style={styles.priceRow}>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="Min"
                placeholderTextColor="#000"
                value={priceMin}
                onChangeText={setPriceMin}
              />
              <Text style={{ marginHorizontal: 8, color: "#63828b" }}>—</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                placeholder="Max"
                placeholderTextColor="#000"
                value={priceMax}
                onChangeText={setPriceMax}
              />
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => setShowPriceModal(false)}
              >
                <Text style={styles.applyTxt}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const CARD_RADIUS = 14;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  headerCard: {
    backgroundColor: "#fff",
    marginLeft: 12,
    marginRight: 12,
    marginBottom: 12,
    marginTop: 30,
    padding: 14,
    borderRadius: CARD_RADIUS,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#0A3D4A" },
  headerSub: { color: "#63828b", marginTop: 2 },
  searchRow: {
    marginTop: 12,
    backgroundColor: "#f1f6f8",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    alignItems: "center",
    flexDirection: "row",
  },
  searchInput: { flex: 1, marginLeft: 8, color: "#0A3D4A" },
  filterRow: { flexDirection: "row", marginTop: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7f5f9",
    borderWidth: 1,
    borderColor: "#bfe6ef",
    paddingHorizontal: 10,
    height: 34,
    borderRadius: 20,
    marginRight: 8,
  },
  chipTxt: { marginLeft: 6, color: "#0A7EA4", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    marginVertical: 8,
    borderRadius: CARD_RADIUS,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardImg: { width: "100%", height: 120 },
  cardBody: {
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between", // 👈 ensures ADD button stays at bottom
    flexGrow: 1, // 👈 allows body to fill remaining space
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#103844" },
  cardSub: { fontSize: 12, color: "#6e8f99", marginTop: 2 },
  cardPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0A7EA4",
    marginTop: 6,
  },
  addBtn: {
    marginTop: 10,
    backgroundColor: "#0A7EA4",
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addTxt: { color: "#fff", fontWeight: "700", marginLeft: 4 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0A3D4A",
    marginBottom: 12,
  },
  modalChip: {
    borderWidth: 1,
    borderColor: "#dbe9ee",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  modalChipTxt: { color: "#1b4c59", fontWeight: "600" },
  priceRow: { flexDirection: "row", alignItems: "center" },
  priceInput: {
    flex: 1,
    backgroundColor: "#f1f6f8",
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#0A3D4A",
  },
  applyBtn: {
    marginLeft: 10,
    backgroundColor: "#0A7EA4",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
  },
  applyTxt: { color: "#fff", fontWeight: "800" },
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
  resetBtn: {
    marginLeft: 8,
    backgroundColor: "#458d1cff",
    padding: 10,
    paddingVertical: 5,
    backgroundColor: "#458d1cff",
    borderRadius: 6,
  },
  resetText: {
    color: "#f3f8f4ff",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
});
