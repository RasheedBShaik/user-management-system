import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    console.log("🔥 LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 🚨 BLOCK INACTIVE USERS
    if (user.status === "inactive") {
      return res.status(403).json({
        msg: "Account deactivated by admin",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // jwt check
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT_SECRET missing" });
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status, // IMPORTANT
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ---------------- REGISTER ---------------- */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      status: "active", // default
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};