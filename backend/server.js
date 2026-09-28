const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set. Add it to backend/.env");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes with error handling
let authRoutes, venueRoutes, serviceRoutes, bookingRoutes;

try {
  authRoutes = require("./routes/auth");
  venueRoutes = require("./routes/venues");
  serviceRoutes = require("./routes/services");
  bookingRoutes = require("./routes/bookings");
} catch (error) {
  console.error("Error loading routes:", error);
  process.exit(1);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

// MongoDB Connection
// Mongoose does not retry a failed initial connection, so keep trying
const connectDB = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
      console.log("MongoDB Connection Error:", err.message);
      console.log("Retrying MongoDB connection in 5 seconds...");
      setTimeout(connectDB, 5000);
    });
};
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Wedding Planner API is running!" });
});

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
