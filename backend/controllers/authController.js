import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    console.log("🔥 LOGIN BODY:", req.body);

    const { email, password } = req.body;

    // ✅ validation
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email or password missing",
      });
    }

    // 🔍 find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }

    // 🔐 check password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        msg: "Invalid credentials",
      });
    }

    // 🔐 check JWT secret
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        msg: "JWT_SECRET missing in .env",
      });
    }

    // 🎟 generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ response
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR ❌:", err);
    return res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};