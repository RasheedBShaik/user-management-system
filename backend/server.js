import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// 1. CONFIGURATION
dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://user-management-system-five-alpha.vercel.app",
];

// 2. CORS CONFIGURATION
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || origin.startsWith("http://localhost:");
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`❌ CORS Blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

// Apply CORS to all requests
app.use(cors(corsOptions));

// 3. MANUAL PREFLIGHT HANDLER (The "Express 5 Fix")
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow EVERYONE
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 4. BODY PARSING
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. ROUTE IMPORTS
// Ensure your route files use 'export default router;'
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/customers", customerRoutes);

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Backend Live 🚀",
    database: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
  });
});

// 6. DATABASE CONNECTION & SERVER STARTUP
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is missing in your environment variables!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    // Only listen once the DB is ready
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });