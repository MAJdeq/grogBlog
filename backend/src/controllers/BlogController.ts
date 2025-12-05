import type { Request, Response } from "express";
import {s3} from "../lib/blob";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import * as blogService from "../services/BlogService";


export const add_blog = async (req: Request, res: Response) => {

  try {

    const { title, author, content } = req.body;
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const command = new PutObjectCommand({
        Bucket: "grog_banners",
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    })

    await s3.send(command);

    const publicUrl = `${process.env.PUBLIC_URL}/${file.originalname}`

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