import { prisma } from "../lib/db";
import bcrypt from "bcrypt";
import { Response } from "express";
import jwt from "jsonwebtoken";

export const signIn = async (email: string, password: string) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { admin, token };
};

export const signOut = async () => {
  return { success: true };
};

export const me = async (token: string) => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");

    // Verify the token and get the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // you can type this as JwtPayload if needed
  } catch (err) {
    throw new Error("Invalid token"); // controller will catch this
  }
};
