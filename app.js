// backend/src/app.js

import express from "express";
import cors from "cors";
import morgan from "morgan";
import issueRoutes from "./routes/issueRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// === FIX: Define allowed origins explicitly ===
const allowedOrigins = [
  "http://localhost:5173",             // Local development
  "https://bm2kglobal.vercel.app",     // Deployed Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like Postman, curl, server-to-server)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ... baaki app.use() code same rahega
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "oid-backend", timestamp: new Date().toISOString() });
});

app.use("/api/issues", issueRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;