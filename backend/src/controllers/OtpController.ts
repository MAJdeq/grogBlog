import type { Request, Response } from "express";
import * as otpService from "../services/OtpService";
import { OTP } from "../emails/emails";

export const generateOTP = async (req: Request, res: Response) => {
    const { email, purpose } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const { message, code } = await otpService.generate_otp(email, otp, purpose);

        if (code) {
            // Send the OTP via email
            await OTP(code, email);
            
            // Send success response (DON'T send the code to the client!)
            return res.status(200).json({ 
                message: "OTP sent to your email successfully!" 
            });
        } else {
            // Handle error case
            return res.status(500).json({ 
                message: message, 
            });
        }

    } catch (e: any) {
        res.status(401).json({ message: e.message });
    }
}

export const verifyOTP = async (req: Request, res: Response) => {
    const {email, otp, purpose } = req.body;

    try {
        const { resetToken } = await otpService.verify_otp(email, otp, purpose);

        return res.status(200).json({
            resetToken: resetToken
        })
    } catch (e: any) {
        res.status(401).json({ message: e.message });
    }
}