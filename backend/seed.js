import 'dotenv/config'; // This loads variables from .env into process.env
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dns from 'dns';

// Optional: Fix for the ECONNREFUSED error we saw earlier
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function seed() {
  try {
    // Use process.env.MONGO_URI (the name inside your .env file)
    const uri = process.env.MONGO_URI; 
    
    if (!uri) {
        throw new Error("MONGO_URI is missing from your .env file!");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB for seeding...");

    const hashed = await bcrypt.hash("123456", 10);

    // Clean up existing admin to prevent duplicate errors
    await User.deleteOne({ email: "admin@test.com" });

    await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: hashed,
      role: "admin",
      status: "active"
    });

    console.log("✅ Admin created");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();