import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Laravel backend base URL
const API = axios.create({
  baseURL: "https://rupayaninfotech.com/drughouse/api", // Android emulator localhost
  timeout: 10000,
});

// Add token automatically if available
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
