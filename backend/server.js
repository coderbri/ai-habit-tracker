/**
 * @file: server.js
 * @description: Application entry point for Express server configuration and initialization.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import logRoutes from "./routes/logs.js";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

/**
 * * Parse and format allowed origins from CLIENT_URL env
 * Defines which clients can access the API via a comma-separated CLIENT_URL
 * env variable, normalized by trimming whitespace and removing empty values
 * to keep it clean and resilient.
 */
const allowedOrigin = (process.env.CLIENT_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const corsOptions = {
    origin(origin, cb) {
        // Allow requests with no origin (curl, same-origin, server-to-server)
        if (!origin) return cb(null, true);
        // Allow any localhost / 127.0.0.1 origin in development
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return cb(null, true);
        }
        // Allow anything explicitly listed in CLIENT_URL (comma-separated)
        if (allowedOrigin.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// === GLOBAL MIDDLEWARE ===
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

/** Uptime and system responsiveness check with a 
    timestamp for monitoring and debugging in production. */
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

// ==== ROUTE HANDLERS =====
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/logs", logRoutes);

// ==== ERROR HANDLING =====
/** Error-handling middleware: catches unknown routes and processes all
    application errors in a consistent format for maintainability. */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

// ensure database connection before starting the server
connectDB().then(() => {
    app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
    );
});