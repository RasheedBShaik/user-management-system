import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body); // DEBUG

    // 1. check user
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", isMatch); // DEBUG

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. check status (optional)
    if (user.status && user.status === "inactive") {
      return res.status(403).json({ msg: "User inactive" });
    }

    // 4. create JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};