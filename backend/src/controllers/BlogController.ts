import type { Request, Response } from "express";
import {s3} from "../lib/blob";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as blogService from "../services/BlogService";
import jwt from "jsonwebtoken";
import { CreationNotis } from "../emails/emails";


export const add_blog = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const authorId = decoded.userId;
    
    const { title, content } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }
    
    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: "grog_blog_banners",
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    
    await s3.send(command);
    const publicUrl = `${process.env.PUBLIC_URL}grog_blog_banners/${file.originalname}`;
    
    // Create blog with authorId
    const { newBlog } = await blogService.addBlog(title, authorId, content, publicUrl);

    console.log("calling creation notis")
    CreationNotis('blog', title).catch(err => {
      console.log("couldn't send emails out:", err)
    });
    
    res.status(201).json({ newBlog });
    
  } catch (e: any) {
    console.error("Error adding blog:", e);
    
    if (e.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    res.status(500).json({ message: e.message || "Internal server error" });
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

export const edit_blog = async (req: Request, res: Response) => {
  try {
    const { id, title, content } = req.body;
    const newFile = req.file; // optional

    // 1. Fetch existing blog
    const oldBlog = await blogService.getBlog(id);
    if (!oldBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    let bannerUrl = oldBlog.bannerUrl;

    // 2. If a new banner was uploaded, replace the old image
    if (newFile) {
      const oldFileKey = oldBlog.bannerUrl.split("/").pop();
      const newFileKey = newFile.originalname;

      // Delete the old file
      if (oldFileKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "grog_blog_banners",
            Key: oldFileKey,
          })
        );
      }

      // Upload the new file with a NEW NAME
      await s3.send(
        new PutObjectCommand({
          Bucket: "grog_blog_banners",
          Key: newFileKey,
          Body: newFile.buffer,
          ContentType: newFile.mimetype,
        })
      );

      // Update banner URL
      bannerUrl = `${process.env.PUBLIC_URL}grog_blog_banners/${newFileKey}`;
    }

    // 3. Update blog in DB
    const updatedBlog = await blogService.updateBlog(id, {
      title,
      content,
      bannerUrl,
      updatedAt: new Date(),
    });

    return res.json({ updatedBlog });

  } catch (e: any) {
    console.error("EDIT_BLOG ERROR:", e);
    return res.status(500).json({ message: e.message || "Internal server error" });
  }
};




