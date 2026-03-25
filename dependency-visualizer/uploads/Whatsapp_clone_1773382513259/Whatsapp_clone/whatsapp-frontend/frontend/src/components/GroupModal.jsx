// src/components/GroupModal.jsx
import React, { useState } from "react";
import API from "../api/api";
import "./GroupModal.css";

export default function GroupModal({ chatInfo, user, onClose, onUpdate }) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [localChat, setLocalChat] = useState(chatInfo); // local state to update instantly

  // ==========================
  // Search users not in the group
  // ==========================
  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearch(q);
    if (!q) return setSearchResults([]);

    try {
      const res = await API.get(`/users?q=${q}`);
      // filter users who are already in the group
      const filtered = res.data.filter(
        (u) => !localChat.users.some((cu) => cu._id === u._id)
      );
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================
  // Add user to group
  // ==========================
  const addUser = async (userId) => {
    try {
      const res = await API.put("/chats/group/add", {
        chatId: localChat._id,
        userId,
      });
      setLocalChat(res.data); // update local chat state
      setSearch("");
      setSearchResults([]);
      onUpdate(); // notify parent to reload chat if needed
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  // ==========================
  // Remove user from group
  // ==========================
  const removeUser = async (userId) => {
    try {
      const res = await API.put("/chats/group/remove", {
        chatId: localChat._id,
        userId,
      });
      setLocalChat(res.data); // update local chat state
      onUpdate();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove user");
    }
  };

  // ==========================
  // Check if current user is admin
  // ==========================
  const isAdmin = user._id === localChat.groupAdmin._id;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{localChat.chatName} (Group)</h3>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* ========================== */}
        {/* MEMBERS LIST */}
        {/* ========================== */}
        <div className="members-list">
          <h4>Members:</h4>
          <ul>
            {localChat.users.map((u) => (
              <li key={u._id}>
                <span className={u._id === localChat.groupAdmin._id ? "admin" : ""}>
                  {u.username} {u._id === localChat.groupAdmin._id && "(Admin)"}
                </span>

                {/* Only admin can remove other members */}
                {isAdmin && u._id !== localChat.groupAdmin._id && (
                  <button className="remove-btn" onClick={() => removeUser(u._id)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ========================== */}
        {/* ADD MEMBER (only admin) */}
        {/* ========================== */}
        {isAdmin && (
          <div className="add-member">
            <input
              type="text"
              placeholder="Search users to add"
              value={search}
              onChange={handleSearch}
            />
            <ul>
              {searchResults.map((u) => (
                <li key={u._id}>
                  {u.username}{" "}
                  <button onClick={() => addUser(u._id)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
