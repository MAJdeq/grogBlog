import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import movieRoutes from "./routes/mediaRoutes";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL!,
  'https://grogblog.xyz',
  'https://www.grogblog.xyz',
  'http://localhost:5173', // For local development
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/media", movieRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.HOST}:${process.env.PORT}`);
});
