// src/components/MessageInput.jsx
import React, { useState, useContext } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import EmojiPicker from "emoji-picker-react";
import "./MessageInput.css";

export default function MessageInput({ selectedChat, onMessageSent }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);

  const sendMessage = async () => {
    if (!selectedChat) return;
    if (!text.trim() && !file) return; // allow file-only messages

    setSending(true);

    try {
      const formData = new FormData();
      formData.append("chatId", selectedChat);
      if (text) formData.append("content", text);
      if (file) formData.append("file", file);

      const res = await API.post("/messages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onMessageSent(res.data);
      setText("");
      setFile(null);
      setShowEmoji(false);
    } catch (err) {
      console.error("Send message failed:", err);
    }

    setSending(false);
  };

  const onEmojiClick = (emoji) => {
    setText((prev) => prev + emoji.emoji);
  };

  return (
    <div className="message-input-container">
      {/* Emoji toggle button */}
      <button className="plus-btn" onClick={() => setShowEmoji(!showEmoji)}>
        😊
      </button>

      {/* Emoji picker popup */}
      {showEmoji && (
        <div className="emoji-popup">
          <EmojiPicker onEmojiClick={onEmojiClick} height={350} width={300} />
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* File upload icon */}
      <button
        className="plus-btn"
        onClick={() => document.getElementById("fileInput").click()}
      >
        📎
      </button>

      {/* File name preview */}
      {file && (
        <div className="file-preview">
          📄 {file.name}
          <button className="remove-file" onClick={() => setFile(null)}>
            ✖
          </button>
        </div>
      )}

      {/* Text input */}
      <input
        className="message-input"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        disabled={!selectedChat}
      />

      {/* Send button */}
      <button className="send-btn" onClick={sendMessage} disabled={sending}>
        {sending ? "..." : "Send"}
      </button>
    </div>
  );
}
