// src/pages/ChatPage.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import "./ChatPage.css";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chatpage-container">
      <Sidebar setSelectedChat={setSelectedChat} />
      <ChatBox selectedChat={selectedChat} />
    </div>
  );
}
