// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import ChatPage from "./pages/ChatPage";

import { AuthProvider, AuthContext } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import "./App.css";

function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <SocketProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chats"
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </SocketProvider>
  );
}
