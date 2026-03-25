import { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/api";
import { SocketContext } from "./SocketContext";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const socket = useContext(SocketContext); // 👈 use socket
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("whatsappUser")) || null
  );

  // ================================
  // 🔥 On App Load → Restore Token & Join Socket Room
  // ================================
  useEffect(() => {
    const savedUser = localStorage.getItem("whatsappUser");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      // restore token
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

      // 👇 join socket personal room
      if (socket && parsedUser?._id) {
        socket.emit("join", parsedUser._id);
      }
    }
  }, [socket]);

  // ================================
  // 🔥 REGISTER (with profile pic)
  // ================================
  const register = async (formData) => {
    const res = await axios.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    return res.data;
  };

  // ================================
  // 🔥 LOGIN (sets user, token, and joins socket)
  // ================================
  const login = async (emailOrUsername, password) => {
    const res = await axios.post(
      "/auth/login",
      { emailOrUsername, password },
      { withCredentials: true }
    );

    // Save token for API calls
    axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

    // Set user state
    setUser(res.data);

    // Persist locally
    localStorage.setItem("whatsappUser", JSON.stringify(res.data));
    localStorage.setItem("token", res.data.token);

    // 👇 IMPORTANT: JOIN SOCKET ROOM AFTER LOGIN
    if (socket) {
      socket.emit("join", res.data._id);
    }
  };

  // ================================
  // 🔥 LOGOUT
  // ================================
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch {}

    setUser(null);
    localStorage.removeItem("whatsappUser");
    localStorage.removeItem("token");

    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
