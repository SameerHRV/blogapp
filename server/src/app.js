import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./config/config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { auth0Router } from "./routes/auth0.route.js";
import { commentRouter } from "./routes/comment.route.js";
import { paymentRouter } from "./routes/payment.route.js";
import { postRouter } from "./routes/post.route.js";
import { tagRouter } from "./routes/tag.route.js";
import { router as userRouter } from "./routes/user.route.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({ origin: config.cors }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
import fs from "fs";
import path from "path";
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", commentRouter);
app.use("/api/v1", tagRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", auth0Router);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running",
  });
});

// Error handling middleware
app.use(errorHandler);

export { app };

