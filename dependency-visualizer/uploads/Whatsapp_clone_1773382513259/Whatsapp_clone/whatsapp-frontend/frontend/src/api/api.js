// src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // if backend uses cookies
});

// request interceptor to add token automatically
API.interceptors.request.use((config) => {
  const raw = localStorage.getItem("whatsappUser"); // use your correct key
  if (raw) {
    try {
      const user = JSON.parse(raw);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch (e) {
      console.error("Error parsing token from localStorage", e);
    }
  }
  return config;
});

// ===============================
// Named exports for message updates
// ===============================
export const markMessageDelivered = (messageId) => {
  return API.post("/messages/delivered", { messageId });
};

export const markMessageRead = (messageId) => {
  return API.post("/messages/read", { messageId });
};

export default API;
