// src/components/ChatBox.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import API, { markMessageDelivered, markMessageRead } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import MessageInput from "./MessageInput";
import GroupModal from "./GroupModal";
import "./ChatBox.css";
import Message from "./Message";

export default function ChatBox({ selectedChat }) {
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [messages, setMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [userStatus, setUserStatus] = useState({
    online: false,
    lastSeen: null,
  });
  const [showGroupModal, setShowGroupModal] = useState(false);

  const messagesRef = useRef();

  const getImageUrl = (path) =>
    path ? `http://localhost:5000${path}` : "/default-avatar.png";




useEffect(() => {
  if (!socket) return;

  // Listener for delivered messages
  socket.on("messageDelivered", (msgId) => {
    setMessages(prev =>
      prev.map(m => (m._id === msgId ? { ...m, status: "delivered" } : m))
    );
  });

  // Listener for read messages
  socket.on("messageRead", (msgId) => {
    setMessages(prev =>
      prev.map(m => (m._id === msgId ? { ...m, status: "read" } : m))
    );
  });

  // Cleanup on unmount
  return () => {
    socket.off("messageDelivered");
    socket.off("messageRead");
  };
}, [socket]);

  // ------------------------------
  // Load chat
  // ------------------------------
  const loadChat = async () => {
    if (!selectedChat) return;

    try {
      const res = await API.get(`/messages/${selectedChat}`);
      setMessages(res.data);

      const chatRes = await API.get(`/chats/${selectedChat}`);
      const chat = chatRes.data;
      setChatInfo(chat);

      if (!chat.isGroup) {
        const otherUser = chat.users.find((u) => u._id !== user._id);
        if (otherUser) {
          setUserStatus({
            online: otherUser.online,
            lastSeen: otherUser.lastSeen,
          });
        }
      }

     // 🔥 Update this part
res.data.forEach(async (msg) => {
  if (msg.sender._id !== user._id && msg.status !== "read") {
    const readMsg = await markMessageRead(msg._id);
    setMessages(prev =>
      prev.map(m =>
        m._id === msg._id ? { ...m, status: readMsg.data.status || "read" } : m
      )
    );
  }
});

    } catch (err) {
      console.warn("Error loading chat", err);
    }

    scrollToBottom();
  };

  // useEffect(() => {
  //   loadChat();
  // }, [selectedChat, user._id]);

useEffect(() => {
  if (!socket) return;

  const handleNewMessage = async (msg) => {
    if (msg.chat?._id === selectedChat) {
      setMessages((prev) => [...prev, msg]);

      // If message is from someone else, mark delivered and read
      if (msg.sender._id !== user._id) {
        // Update backend status
        const deliveredMsg = await markMessageDelivered(msg._id);
        const readMsg = await markMessageRead(msg._id);

        // Update frontend state
        setMessages((prev) =>
          prev.map((m) =>
            m._id === msg._id
              ? { ...m, status: readMsg.data.status || "read" }
              : m
          )
        );
      }

      scrollToBottom();
    } else {
      if (window.loadChatsFromSidebar) window.loadChatsFromSidebar();
    }
  };

  socket.on("newMessage", handleNewMessage);

  return () => socket.off("newMessage", handleNewMessage);
}, [socket, selectedChat, user._id]);



  useEffect(() => {
  if (!selectedChat) return;

  loadChat();

  // 🔥 Mark all messages as read when user opens this chat
  API.put(`/messages/read/${selectedChat}`)
    .then(() => {
      if (window.loadChatsFromSidebar) {
        window.loadChatsFromSidebar(); // refresh sidebar unread count
      }
    })
    .catch((err) => console.error("Failed to mark messages read:", err));

}, [selectedChat, user._id]);

  // ------------------------------
  // Socket listeners
  // ------------------------------
  // useEffect(() => {
  //   if (!socket) return;

  //   const handleMessage = async (msg) => {
  //     if (msg.chat?._id === selectedChat) {
  //       setMessages((prev) => [...prev, msg]);

  //       if (msg.sender._id !== user._id) {
  //         await markMessageDelivered(msg._id);
  //         await markMessageRead(msg._id);
  //       }
  //     }
  //   };

  //   socket.on("messageReceived", handleMessage);

  //   socket.on("messageDeleted", (messageId) => {
  //     setMessages((prev) => prev.filter((m) => m._id !== messageId));
  //   });

  //   return () => {
  //     socket.off("messageReceived", handleMessage);
  //     socket.off("messageDeleted");
  //   };
  // }, [socket, selectedChat, chatInfo]);

  useEffect(() => {
  if (!socket) return;

  const handleMessage = async (msg) => {
    if (msg.chat?._id === selectedChat) {
      setMessages((prev) => [...prev, msg]);

      if (msg.sender._id !== user._id) {
        await markMessageDelivered(msg._id); // backend
        await markMessageRead(msg._id);      // backend
      }
    }
  };

  socket.on("messageReceived", handleMessage);

  socket.on("messageDeleted", (messageId) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
  });

  // Delivered/read tick updates
  socket.on("messageDelivered", (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === msgId ? { ...m, status: "delivered" } : m))
    );
  });

  socket.on("messageRead", (msgId) => {
    setMessages((prev) =>
      prev.map((m) => (m._id === msgId ? { ...m, status: "read" } : m))
    );
  });

  return () => {
    socket.off("messageReceived", handleMessage);
    socket.off("messageDeleted");
    socket.off("messageDelivered");
    socket.off("messageRead");
  };
}, [socket, selectedChat, chatInfo]);



  // ------------------------------
  // Auto scroll
  // ------------------------------
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  // ------------------------------
  // Delete Handlers
  // ------------------------------
  const handleDeleteForMe = async (messageId) => {
  try {
    await API.delete(`/messages/deleteForMe/${messageId}`, {
      headers: { Authorization: `Bearer ${user.token}` }, // ensure auth header
    });
    
    // Remove message from UI for this user
    setMessages(prev => prev.filter(m => m._id !== messageId));
    
    // Optional: Emit event to update chat if needed
    socket.emit("deleteMessageForMe", { messageId, userId: user._id });
  } catch (err) {
    console.error("Delete for me error:", err);
  }
};

const handleDeleteForEveryone = async (messageId) => {
  try {
    await API.delete(`/messages/${messageId}`, {
      headers: { Authorization: `Bearer ${user.token}` }, // ensure auth header
    });

    // Remove message from UI for everyone
    setMessages(prev => prev.filter(m => m._id !== messageId));

    // Emit socket event to notify all chat members
    socket.emit("messageDeleted", messageId);
  } catch (err) {
    console.error("Delete for everyone error:", err);
  }
};

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <div className="chatbox">
      <div className={`chatbox-content ${showGroupModal ? "blur" : ""}`}>
        {!selectedChat ? (
          <div className="no-chat">
            <h3>Select a chat to start messaging</h3>
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="chat-header">
              <div className="chat-header-left">
                <img
                  src={
                    chatInfo?.isGroup
                      ? "/group.png"
                      : getImageUrl(
                          chatInfo?.users.find((u) => u._id !== user._id)
                            ?.profilePic
                        )
                  }
                  className="chat-avatar"
                  alt="avatar"
                />

                <div className="chat-meta">
                  <div className="chat-username">
                    {chatInfo?.isGroup
                      ? chatInfo.chatName
                      : chatInfo?.users.find((u) => u._id !== user._id)?.username}
                  </div>

                  <div className="chat-status">
                    {chatInfo?.isGroup
                      ? `${chatInfo.users.length} members`
                      : userStatus.online
                      ? "online"
                      : userStatus.lastSeen
                      ? `last seen ${new Date(
                          userStatus.lastSeen
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : ""}
                  </div>
                </div>
              </div>

              {chatInfo?.isGroup && (
                <button
                  className="group-info-btn"
                  onClick={() => setShowGroupModal(true)}
                >
                  Group Info
                </button>
              )}
            </div>

          {/* MESSAGE AREA */}
{/* MESSAGE AREA */}
<div className="messages" ref={messagesRef}>
  {messages.map((msg) => {
    const isSent = msg.sender?._id === user._id;

    return (
      <Message
        key={msg._id}
        msg={msg}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
      >
        <div className={isSent ? "sent" : "received"}>
          <div className="bubble">

            {/* Group sender name (only for received msgs) */}
            {!isSent && chatInfo?.isGroup && (
              <div className="sender-name">{msg.sender.username}</div>
            )}

            {/* TEXT */}
            {msg.content && (
              <div className="message-content">{msg.content}</div>
            )}

            {/* IMAGE */}
            {msg.image && (
              <img
                className="message-image"
                src={`http://localhost:5000${msg.image}`}
                alt="message-img"
              />
            )}

            {/* VIDEO */}
            {msg.video && (
              <video
                src={`http://localhost:5000${msg.video}`}
                className="message-video"
                controls
              />
            )}

            {/* FILE */}
            {msg.file && (
              <a
                href={`http://localhost:5000${msg.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="message-file"
              >
                📄 {msg.fileName || "Download File"}
              </a>
            )}

            {/* TIME + TICKS */}
            <div className="message-meta">
              <span className="time">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

//              {isSent && (
         <span
    className={`tick ${
      msg.status === "delivered" || msg.status === "read" ? "double" : ""
    } ${msg.status === "read" ? "read" : ""}`}
  >
    {msg.status === "delivered" || msg.status === "read" ? "✔✔" : "✔"}
  </span>
 )}

{/* {isSent && (
  <span
    className={`tick 
      ${msg.status === "delivered" || msg.status === "read" ? "double" : ""}
      ${msg.status === "read" ? "read" : ""}
    `}
  >
    {msg.status === "sent" && "✔"}
    {msg.status === "delivered" && "✔✔"}
    {msg.status === "read" && "✔✔"}
  </span>
)} */}



            </div>
          </div>
        </div>
      </Message>
    );
  })}
</div>


            

            {/* INPUT */}
            <div className="message-input-container">
              <MessageInput
                selectedChat={selectedChat}
                onMessageSent={addMessage}
              />
            </div>
          </>
        )}
      </div>

      {showGroupModal && (
        <GroupModal
          chatInfo={chatInfo}
          user={user}
          onClose={() => setShowGroupModal(false)}
          onUpdate={loadChat}
        />
      )}
    </div>
  );
}
