import { prisma } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { user, token };
};

export const signUp = async (email: string, name: string, password: string) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: password
    }
  })

  const token = jwt.sign(
    { email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { user, token }
}

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
