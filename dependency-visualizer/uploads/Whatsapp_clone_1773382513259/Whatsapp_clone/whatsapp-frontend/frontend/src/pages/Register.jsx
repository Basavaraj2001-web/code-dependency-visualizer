import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Register.css";

export default function Register() {
const { register, login } = useContext(AuthContext);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [profilePic, setProfilePic] = useState(null);
const [preview, setPreview] = useState(null);
const [err, setErr] = useState("");
const navigate = useNavigate();

const handleFileChange = (e) => {
const file = e.target.files[0];
setProfilePic(file);
if (file) {
setPreview(URL.createObjectURL(file));
} else {
setPreview(null);
}
};

const handleSubmit = async (e) => {
e.preventDefault();
setErr("");
try {
const formData = new FormData();
formData.append("username", name);
formData.append("email", email);
formData.append("password", password);
if (profilePic) formData.append("profilePic", profilePic);


  // Call your backend register function
  await register(formData);

  // Optional: auto-login after registration
  await login(email, password);
  navigate("/chats");
} catch (error) {
  console.error(error);
  setErr(error.response?.data?.message || "Registration failed.");
}


};

return ( <div className="auth-page"> <form className="auth-form" onSubmit={handleSubmit}> <h2>Register</h2>
{err && <div className="auth-error">{err}</div>}


    <input
      placeholder="Full name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
    <input
      placeholder="Email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
    />
    {preview && (
      <div className="preview-container">
        <img src={preview} alt="preview" className="preview-img" />
      </div>
    )}
    <button type="submit">Create account</button>
    <p>
      Already have an account? <Link to="/">Login</Link>
    </p>
  </form>
</div>


);
}
