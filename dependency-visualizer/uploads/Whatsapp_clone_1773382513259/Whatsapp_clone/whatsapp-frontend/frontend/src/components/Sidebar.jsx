// src/components/Sidebar.jsx
import React, { useContext, useEffect, useState } from "react";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

import { SocketContext } from "../context/SocketContext";


export default function Sidebar({ selectedChat, setSelectedChat }) {
  const { user, logout, setUser } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Profile modal visibility
  const [showProfile, setShowProfile] = useState(false);


  const [showGroupModal, setShowGroupModal] = useState(false);
const [groupName, setGroupName] = useState("");
const [selectedMembers, setSelectedMembers] = useState([]);


  // Helper to get full image URL
  const getImageUrl = (path) =>
    path ? `http://localhost:5000${path}` : "/default-avatar.png";

  const loadChats = async () => {
    try {
      const res = await API.get("/chats/my");
      //setChats(res.data.reverse());

      // Sort: unread first, then latestMessage time
const sorted = res.data.sort((a, b) => {
  const unreadA = a.unreadCount || 0;
  const unreadB = b.unreadCount || 0;

  if (unreadA !== unreadB) {
    return unreadB - unreadA; // unread on top
  }

  // If both have same unread → sort by latest message createdAt
  const timeA = a.latestMessage ? new Date(a.latestMessage.createdAt) : 0;
  const timeB = b.latestMessage ? new Date(b.latestMessage.createdAt) : 0;

  return timeB - timeA;
});

setChats(sorted);


    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  const socket = useContext(SocketContext);
  useEffect(() => {
  socket.on("newMessage", () => {
    if (window.loadChatsFromSidebar) {
      window.loadChatsFromSidebar(); // refresh sidebar
    }
  });

  return () => {
    socket.off("newMessage"); // cleanup on unmount
  };
}, [socket]);


useEffect(() => {
  if (!socket) return;

  socket.on("newMessage", () => {
    if (window.loadChatsFromSidebar) window.loadChatsFromSidebar();
  });

  return () => socket.off("newMessage");
}, [socket]);


  // useEffect(() => {
  //   loadChats();
  // }, []);

  useEffect(() => {
  window.loadChatsFromSidebar = loadChats;  // expose globally
  loadChats();
}, []);


  const toggleMemberSelect = (u) => {
  if (selectedMembers.some((m) => m._id === u._id)) {
    setSelectedMembers(selectedMembers.filter((m) => m._id !== u._id));
  } else {
    setSelectedMembers([...selectedMembers, u]);
  }
};



const createGroup = async () => {
  if (!groupName) return alert("Enter group name");
  if (selectedMembers.length === 0) return alert("Add at least 1 member");

  try {
    const res = await API.post("/chats/group", {
      name: groupName,
      userIds: selectedMembers.map((m) => m._id),
    });

    alert("Group created!");
    setShowGroupModal(false);
    setGroupName("");
    setSelectedMembers([]);

    loadChats(); // reload chat list
  } catch (err) {
    console.error(err);
    alert("Failed to create group");
  }
};



  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query) return setSearchResults([]);

    try {
      const res = await API.get(`/users?q=${query}`);
      const filtered = res.data.filter((u) => u._id !== user._id);
      setSearchResults(filtered);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  const handleUserClick = async (u) => {
    try {
      const res = await API.post("/chats/one", { userId: u._id });
      setSelectedChat(res.data._id);
      setSearch("");
      setSearchResults([]);
      loadChats();
    } catch (err) {
      console.error("Failed to create/fetch chat", err);
    }
  };

  // -----------------------------
  // UPDATE PROFILE PICTURE
  // -----------------------------
  const updatePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await API.put("/users/profile-pic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile picture updated!");

      // Update global auth user
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setShowProfile(false);
    } catch (err) {
      console.error("Error updating profile picture", err);
    }
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="brand">WhatsApp</div>

        <div className="profile" onClick={() => setShowProfile(true)}>
          <img
            src={getImageUrl(user?.profilePic)}
            alt="me"
            className="nav-avatar"
          />
        </div>
      </div>

      <div className="create-group-btn" onClick={() => setShowGroupModal(true)}>
      + Create Group
      </div>


      {/* Search */}
      <div className="sidebar-search">
        <input
          placeholder="Search or start new chat"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((u) => (
            <div
              key={u._id}
              className="chat-item"
              onClick={() => handleUserClick(u)}
            >
              <img
                src={getImageUrl(u.profilePic)}
                alt={u.username}
                className="chat-item-avatar"
              />
              <div className="chat-item-info">
                <b>{u.username}</b>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat list */}
      <div className="chat-list">
        {chats.length === 0 && <div className="empty">No chats yet</div>}
        {chats.map((chat) => {
         const other = chat.isGroup
              ? { username: chat.chatName, profilePic: "/group.png" }
              : chat.users.find((u) => u._id !== user._id);

          return (
            <div
              key={chat._id}
              className={`chat-item 
                 ${selectedChat === chat._id ? "selected" : ""} 
                 ${chat.unreadCount > 0 ? "unread" : ""}
                `}

              onClick={() => setSelectedChat(chat._id)}
            >
              <img
                src={getImageUrl(other?.profilePic)}
                className="chat-item-avatar"
                alt={other?.username}
              />
              <div className="chat-item-info">
                <div className="chat-item-top">
                  <b>{other?.username || chat.chatName}</b>
                  <span className="time">
                    {chat.latestMessage
                      ? new Date(
                          chat.latestMessage.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <div className="chat-item-bottom">
                  <span className="preview">
                    {chat.latestMessage?.content || "Say hi 👋"}
                  </span>

                  {chat.unreadCount > 0 && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => logout()}>
          Logout
        </button>
      </div>

      {/* ---------------- PROFILE MODAL ---------------- */}
      {showProfile && (
        <div className="profile-modal">
          <div className="profile-card">
            <span className="close" onClick={() => setShowProfile(false)}>
              ×
            </span>

            <img
              src={getImageUrl(user?.profilePic)}
              alt="profile"
              className="profile-large"
            />

            <label className="upload-btn">
              Update Profile Picture
              <input type="file" accept="image/*" onChange={updatePic} hidden />
            </label>

            <h3>{user.username}</h3>
            <p>{user.email}</p>
          </div>
        </div>
      )}

      {showGroupModal && (
  <div className="profile-modal">
    <div className="profile-card group-card">

      <span className="close" onClick={() => setShowGroupModal(false)}>×</span>

      <h2>Create Group</h2>

      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="group-input"
      />

      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={handleSearch}
        className="group-input"
      />

      <div className="search-results">
        {searchResults.map((u) => (
          <div
            key={u._id}
            className={`chat-item ${selectedMembers.some((m) => m._id === u._id) ? "selected" : ""}`}
            onClick={() => toggleMemberSelect(u)}
          >
            <img
              src={getImageUrl(u.profilePic)}
              className="chat-item-avatar"
              alt=""
            />
            <b>{u.username}</b>
          </div>
        ))}
      </div>

      {/* SELECTED MEMBERS LIST */}
      <div className="selected-members">
        {selectedMembers.map((m) => (
          <div key={m._id} className="selected-member">
            <img src={getImageUrl(m.profilePic)} alt="" />
            <span>{m.username}</span>
          </div>
        ))}
      </div>

      <button className="create-btn" onClick={createGroup}>
        Create Group
      </button>

    </div>
  </div>
)}

    </div>
  );
}
