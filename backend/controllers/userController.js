import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* ---------------- GET ALL USERS (ADMIN ONLY) ---------------- */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
};


/* ---------------- CREATE USER (ADMIN ONLY) ---------------- */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
      status: "active"
    });

    res.status(201).json(user);

  } catch (err) {
    res.status(500).json({ msg: "Failed to create user" });
  }
};


/* ---------------- UPDATE ANY USER (ADMIN POWER) ---------------- */
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ msg: "Failed to update user" });
  }
};


/* ---------------- DELETE USER (ADMIN ONLY) ---------------- */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};


/* ---------------- GET LOGGED IN USER (SELF PROFILE) ---------------- */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch profile" });
  }
};


/* ---------------- USER UPDATE OWN PROFILE ---------------- */
export const updateMe = async (req, res) => {
  try {
    const updates = req.body;

    // prevent role changes by user
    delete updates.role;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("-password");

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ msg: "Failed to update profile" });
  }
};


/* ---------------- ADMIN: ACTIVATE / DEACTIVATE USER ---------------- */
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.status = user.status === "active" ? "inactive" : "active";

    await user.save();

    res.status(200).json({
      msg: `User is now ${user.status}`,
      user,
    });

  } catch (err) {
    res.status(500).json({ msg: "Failed to update status" });
  }
};