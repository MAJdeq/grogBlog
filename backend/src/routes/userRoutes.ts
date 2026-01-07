import express from "express";
import * as UserController from "../controllers/UserController";

const router = express.Router();

router.get("/get_subscribers", UserController.get_subscribers);
router.get("/getUsers", UserController.getUsers); // Add this line
router.post("/unsubscribe", UserController.unsubscribe);
router.post("/subscribe", UserController.subscribe);
router.post("/updateRole", UserController.updateRole);

export default router;