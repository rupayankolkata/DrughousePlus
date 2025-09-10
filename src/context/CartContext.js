// src/context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔹 Load cart from storage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("cart");
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };
    loadCart();
  }, []);

  // 🔹 Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(cartItems));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };
    if (cartItems.length >= 0) {
      saveCart();
    }
  }, [cartItems]);

  // 🔹 Add item
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === item.id);
      if (existing) {
        return prev.map((it) =>
          it.id === item.id ? { ...it, qty: it.qty + item.qty } : it
        );
      }
      return [...prev, item];
    });
  };

  // 🔹 Remove item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  };

  // 🔹 Update quantity
  const updateQuantity = (id, qty) => {
    setCartItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, qty } : it))
    );
  };

  // 🔹 Clear cart (optional, useful after checkout)
  const clearCart = () => {
    setCartItems([]);
    AsyncStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
