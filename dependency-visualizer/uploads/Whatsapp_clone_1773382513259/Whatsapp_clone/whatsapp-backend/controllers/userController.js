const User = require('../models/User');

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.searchUsers = async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  const users = await User.find({
    $or: [{ username: regex }, { email: regex }]
  }).select('-password');
  res.json(users);
};

exports.getUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("username online lastSeen profilePic");

  if (!user) return res.status(404).json({ message: "User not found" });

  res.json(user);
};


exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;   // From auth middleware
    const newPic = req.file ? `/uploads/${req.file.filename}` : null;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: newPic },
      { new: true }
    );

    res.json({
      message: "Profile picture updated",
      profilePic: user.profilePic
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
