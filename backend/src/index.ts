import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";

const app = express();
const port = 5000;

app.use(express.json());
app.use(cookieParser());

// ✅ Configure CORS for cookies
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true, // allow sending/receiving cookies
  })
);

app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
