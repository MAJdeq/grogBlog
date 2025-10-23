import type { Request, Response } from "express";
import * as authService from "../services/AuthService";
import jwt from "jsonwebtoken";

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { admin, token } = await authService.signIn(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.json({
      message: "Signed in successfully",
      user: { id: admin.id, email: admin.email, name: admin.name },
      token,
    });
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "lax",
      path: "/", // must match the path used when setting the cookie
    });

    res.json({ success: true, message: "Logged out successfully!" });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    // Read token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Pass token to service for verification
    const decoded = await authService.me(token);

    // Respond with user info from decoded token
    res.json({ user: decoded });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Unauthorized" });
  }
};
