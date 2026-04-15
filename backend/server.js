// ==========================
// 1. DNS FIX (TOP PRIORITY)
// ==========================
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// ==========================
// 2. IMPORTS
// ==========================
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

// ==========================
// 3. CONFIG
// ==========================
dotenv.config();
const app = express();

// ==========================
// 4. SECURITY MIDDLEWARE
// ==========================
app.use(helmet()); // Secure headers
app.use(morgan("dev")); // Request logging

// ==========================
// 5. CORS CONFIG
// ==========================
const allowedOrigins = [
  "http://localhost:3000",
  "https://user-management-system-five-alpha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("⚠️ CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Handle preflight
app.options("*", cors());

// ==========================
// 6. BODY PARSER
// ==========================
app.use(express.json({ limit: "10kb" }));

// ==========================
// 7. ROUTES
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/customers", customerRoutes);

// ==========================
// 8. HEALTH CHECK
// ==========================
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Backend Live 🚀",
    database:
      mongoose.connection.readyState === 1
        ? "Connected ✅"
        : "Disconnected ❌",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ==========================
// 9. ERROR HANDLER (GLOBAL)
// ==========================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==========================
// 10. ENV VALIDATION
// ==========================
const requiredEnv = ["MONGO_URI"];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing ENV Variable: ${key}`);
    process.exit(1);
  }
});

// ==========================
// 11. DATABASE CONNECTION
// ==========================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
    process.exit(1);
  }
};

// ==========================
// 12. SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

// ==========================
// 13. GRACEFUL SHUTDOWN
// ==========================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});