import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

await mongoose.connect("YOUR_MONGO_URI");

const hashed = await bcrypt.hash("123456", 10);

await User.create({
  name: "Admin",
  email: "admin@test.com",
  password: hashed,
  role: "admin",
  status: "active"
});

console.log("Admin created");
process.exit();