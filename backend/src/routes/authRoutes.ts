import express from "express";
import * as AuthController from "../controllers/AuthController";

const router = express.Router();

router.post("/sign_in", AuthController.signIn);
router.post("/sign_out", AuthController.signOut);
router.get("/me", AuthController.me);
router.post("/sign_up", AuthController.signUp)

export default router;
