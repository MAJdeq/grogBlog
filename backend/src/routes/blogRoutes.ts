import express from "express";
import multer from "multer";
import * as BlogController from "../controllers/BlogController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post("/add_blog", upload.single("banner"), BlogController.add_blog);
router.get("/get_blogs", BlogController.get_blogs)
router.post("/get_blog", BlogController.get_blog)
router.delete("/delete_blog", BlogController.delete_blog)
router.put("/edit_blog", upload.single("banner"), BlogController.edit_blog)


export default router;
