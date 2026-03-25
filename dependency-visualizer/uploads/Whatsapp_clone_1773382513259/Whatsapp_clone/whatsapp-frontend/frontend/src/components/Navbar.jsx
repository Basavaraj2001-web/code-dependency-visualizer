import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import "./Navbar.css";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <div className="navbar">
      <h2>WhatsApp Clone</h2>
      {user && (
        <div className="profile-section">
          <span>{user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
