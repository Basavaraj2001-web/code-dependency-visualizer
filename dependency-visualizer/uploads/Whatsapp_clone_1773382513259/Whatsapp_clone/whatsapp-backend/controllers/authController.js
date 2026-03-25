const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// =====================================================
// REGISTER (with profile picture)
// =====================================================
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Please provide all fields" });

    const exists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      profilePic: req.file ? `/uploads/${req.file.filename}` : null,
      online: false,
    });

    return res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// LOGIN → mark user online, return token
// =====================================================
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password)
      return res.status(400).json({ message: "Provide credentials" });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    // Mark user online
    user.online = true;
    user.lastSeen = new Date();
    await user.save();

    const token = generateToken(user);

    // Set cookie (optional, frontend also stores token)
    res.cookie(process.env.COOKIE_NAME || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      online: user.online,
      lastSeen: user.lastSeen,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================================================
// LOGOUT → mark user offline
// =====================================================
exports.logout = async (req, res) => {
  try {
    if (req.user?._id) {
      await User.findByIdAndUpdate(req.user._id, {
        online: false,
        lastSeen: new Date(),
      });
    }
  } catch (err) {
    console.error("Logout error:", err);
  }

  res.clearCookie(process.env.COOKIE_NAME || "token", { path: "/" });
  res.json({ message: "Logged out successfully" });
};
