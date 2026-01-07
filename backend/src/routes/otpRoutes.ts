import express from "express";
import * as OtpController from "../controllers/OtpController";

const router = express.Router();

router.post("/generate_otp", OtpController.generateOTP);
router.post("/verify_otp", OtpController.verifyOTP);



export default router;
