import type { Request, Response } from "express";
import {s3} from "../lib/blob";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as blogService from "../services/BlogService";


export const add_blog = async (req: Request, res: Response) => {

  try {

    const { title, content } = req.body;
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const command = new PutObjectCommand({
        Bucket: "grog_blog_banners",
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    })

    await s3.send(command);

    const publicUrl = `${process.env.PUBLIC_URL}grog_blog_banners/${file.originalname}`

    const { newBlog } = await blogService.addBlog(title, content, publicUrl)

    res.json({ newBlog: newBlog })
    
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const get_blogs = async (req: Request, res: Response) => {
  try {
    const blogs = await blogService.getBlogs();
    res.json({ blogs })
  } catch (e: any) {
    res.status(401).json({ message: e.message })
  }
}

export const get_blog = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; 

    const blog = await blogService.getBlog(id);

    return res.json({ blog });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const delete_blog = async (req: Request, res: Response) => {
  try {
    const { id, blogUrl } = req.body;

    // Extract the file key from URL
    const fileKey = blogUrl.split("/").pop(); // filename.png
    if (!fileKey) return res.status(400).json({ message: "Invalid blog URL" });

    // Delete from R2
    await s3.send(
      new DeleteObjectCommand({
        Bucket: "grog_blog_banners",
        Key: fileKey,
      })
    );

    // Delete from DB
    const blog = await blogService.deleteBlog(id);

    return res.json({ message: "deleted blog", blog });

  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};
