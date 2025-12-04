import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import path from "path";

const app = express();
const port = 3000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: process.env.FRONTEND_URL?.split(','), // This will handle multiple origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
