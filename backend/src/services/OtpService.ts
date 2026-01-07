import bcrypt from "bcrypt";
import { prisma } from "../lib/db";
import jwt from "jsonwebtoken";

const MAX_ATTEMPTS = 3;

export const generate_otp = async (email: string, code: string, purpose: string) => {
    // Check if user exists by email
    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        throw new Error("No account found with this email")
    }

    await prisma.oTP.deleteMany({
        where: {
            OR: [
                { is_used: true },
                { expiresAt: { lt: new Date() } },
                { attempts: MAX_ATTEMPTS}
            ]
        }
    });


    // Hash and create new OTP
    const hashedCode = await bcrypt.hash(code, 10);
    
    await prisma.oTP.create({
        data: {
            email: email,
            otp_hash: hashedCode,
            purpose: purpose,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        }
    });

    return { 
        success: true,
        message: "OTP created successfully!", 
        code: code 
    };
}

export const verify_otp = async (email: string, code: string, purpose: string) => {
    const otpRecord = await prisma.oTP.findFirst({
      where: {
        email,
        purpose, // ✅ fixed
        is_used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!otpRecord) {
      throw new Error("OTP expired or invalid");
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
        throw new Error("Maximum OTP attempts reached");
    }

    const isValid = await bcrypt.compare(code, otpRecord.otp_hash);

    if (!isValid) {
        await prisma.oTP.update({
            where: { id: otpRecord.id },
            data: { attempts: { increment: 1 } },
        });
        throw new Error("Invalid OTP");
    }

    await prisma.oTP.update({
      where: { id: otpRecord.id },
      data: { is_used: true },
    });

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log(user)

    if (!user) {
      throw new Error("User not found");
    }

    const resetToken = jwt.sign(
      {
        userId: user.id,
        purpose,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "10m" }
    );

    return {
      success: true,
      resetToken,
    };
};
