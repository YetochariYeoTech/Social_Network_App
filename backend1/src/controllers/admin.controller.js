import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({ role: { $ne: "ADMIN" } }, "-password")
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments({ role: { $ne: "ADMIN" } });
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ users, totalPages, currentPage: page });
  } catch (error) {
    console.error("Error in getAllUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const lockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isLocked = true;
    user.lockedUntil = Date.now() + 60 * 60 * 1000; // 1 hour

    await user.save();

    res.status(200).json({ message: "User locked successfully" });
  } catch (error) {
    console.error("Error in lockUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isLocked = false;
    user.lockedUntil = null;
    user.failedLoginAttempts = 0;

    await user.save();

    res.status(200).json({ message: "User unlocked successfully" });
  } catch (error) {
    console.error("Error in unlockUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: "Admins cannot be deleted" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
