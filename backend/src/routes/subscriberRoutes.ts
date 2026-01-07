import express from "express";
import * as SubscriberController from "../controllers/SubscriberController";

const router = express.Router();

router.get("/get_subscribers", SubscriberController.get_subscribers);
router.post("/unsubscribe", SubscriberController.unsubscribe);
router.post("/subscribe", SubscriberController.subscribe);



export default router;
