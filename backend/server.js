// server.js
    import express from "express";
    import dotenv from "dotenv";
    import cors from "cors";
    import cookieParser from "cookie-parser";
    import path from "path";

    import { connectDB } from "./config/db.js";
    import { errorHandler, notFound } from "./middleware/error.middleware.js";

    // Import your routes here
    import authRoutes from "./routes/auth.routes.js";
    import servicesRoutes from "./routes/services.routes.js";
    import ordersRoutes from "./routes/orders.routes.js";

    // -----------------------
    // Load environment variables
    // -----------------------
    dotenv.config();

    const app = express();
    const PORT = process.env.PORT || 5000;
    const __dirname = path.resolve();

    // -----------------------
    // Middleware
    // -----------------------
    app.use(express.json());          // Parse JSON request bodies
    app.use(cookieParser());          // Parse cookies

    // Setup CORS
    const origins = (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

    app.use(
    cors({
        origin: origins,
        credentials: true,
    })
    );

    // -----------------------
    // Health Check Route
    // -----------------------
    app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        env: process.env.NODE_ENV || "development",
    });
    });

    // -----------------------
    // API Routes
    // -----------------------
    app.use("/api/auth", authRoutes);
    app.use("/api/services", servicesRoutes);
    app.use("/api/orders", ordersRoutes);

    // -----------------------
    // Error Handling Middleware
    // -----------------------
    app.use(notFound);
    app.use(errorHandler);

    // -----------------------
    // Serve Frontend (Production)
    // -----------------------
    if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
    }

    // -----------------------
    // Server Startup
    // -----------------------
    async function start() {
    try {
        await connectDB(); // Connect to MongoDB (or other DB)
        app.listen(PORT, () =>
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
        );
    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
    }

    start();
