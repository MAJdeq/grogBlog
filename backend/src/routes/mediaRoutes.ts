import express from "express";
import multer from "multer";
import * as MediaReviewController from "../controllers/MediaReviewController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post("/add_media_type", upload.single("banner"), MediaReviewController.add_media);
router.get("/get_media_types", MediaReviewController.get_media_types)
router.post("/get_media_type", MediaReviewController.get_media_type)
router.delete("/delete_media_type", MediaReviewController.delete_media_type)
router.put("/edit_media_type", upload.single("banner"), MediaReviewController.edit_media_type)


export default router;
