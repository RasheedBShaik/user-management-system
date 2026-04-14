import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // delete old test user (optional)
    await User.deleteMany({ email: "test@test.com" });

    const hashed = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Test User",
      email: "test@test.com",
      password: hashed,
      role: "admin",
      status: "active"
    });

    console.log("User created successfully 🚀");

    process.exit();
  } catch (err) {
    console.log("Seed error:", err);
    process.exit(1);
  }
};

seed();