// backend/src/app.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import issueRoutes from "./routes/issueRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://bm2kglobal.vercel.app",
];

// === FIX: Use a function for origin to handle preflight requests correctly ===
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);

    // Check if the origin is in our allowlist
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log the blocked origin for debugging
      console.log("Blocked by CORS:", origin);
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11) choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// === IMPORTANT: Explicitly handle all OPTIONS requests for all routes ===
// This ensures preflight requests are answered correctly.
app.options("*", cors(corsOptions));

// Body parsers and logging
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "oid-backend", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/issues", issueRoutes);

// 404 + error handlers
app.use(notFound);
app.use(errorHandler);

export default app;