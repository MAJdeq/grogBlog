import { prisma } from "../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signIn = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid email or password");

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid email or password");

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { user, token };
};

export const signUp = async (email: string, name: string, password: string, isSubscriber: boolean) => {

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    throw new Error("A user with this email already exists!");
  }

  const newPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: newPassword,
      isSubscriber: isSubscriber
    }
  })

  const token = jwt.sign(
    { userId: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );

  return { user, token }
}

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt)
  return hash;
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

export const resetPassword = async (password: string, resetToken: string) => {
    const payload = jwt.verify(resetToken, process.env.JWT_SECRET!) as {
        userId: string;
        purpose: string;
    };

    console.log(payload)
    if (payload.purpose !== "request_password") {
      throw new Error("Invalid token purpose")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {id: payload.userId},
      data: { password: hashedPassword}
    })
    return { success: true, message: "Password reset successfully" };
}