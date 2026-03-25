// context/SocketContext.jsx
import { createContext, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io("http://localhost:5000");

export const SocketProvider = ({ children }) => {
  const [socketInstance] = useState(socket);
  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
