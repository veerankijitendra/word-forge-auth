import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler";

// Routes
import userRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";

const app: Express = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "API is running healthy" });
});

// App Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Error Handler (must be the last middleware)
app.use(errorHandler);

export default app;
