import express from "express";
import multer from "multer";
import * as MovieReviewController from "../controllers/MovieReviewController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post("/add_movie", upload.single("banner"), MovieReviewController.add_movie);
router.get("/get_movies", MovieReviewController.get_movies)
router.post("/get_movie", MovieReviewController.get_movie)
router.delete("/delete_movie", MovieReviewController.delete_movie)
router.put("/edit_movie", upload.single("banner"), MovieReviewController.edit_movie)


export default router;
