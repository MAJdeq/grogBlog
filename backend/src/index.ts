import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogRoutes";
import movieRoutes from "./routes/mediaRoutes";
import userRoutes from "./routes/userRoutes";
import otpRoutes from "./routes/otpRoutes";
import { limiter } from "./middleware/limiter";

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
app.use("/auth", limiter, authRoutes);
app.use("/blogs", limiter, blogRoutes);
app.use("/media", limiter, movieRoutes);
app.use("/users", limiter, userRoutes);
app.use("/otp", limiter, otpRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
