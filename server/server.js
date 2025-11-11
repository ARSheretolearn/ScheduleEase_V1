import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

import appointmentRoutes from "./routes/appointmentRoutes.js";
import slotRoutes from "./routes/slotRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

; // Initialize passport strategies

connectDB();

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Express session (needed for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "some-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

import("./config/passport.js").then(() => {
  console.log("✅ Passport config loaded");
});

// Routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);

// Health check route
app.get("/", (req, res) => res.send("NITC Appointments Backend is running"));

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
