import type { Request, Response } from "express";
import {s3} from "../lib/blob";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as mediaService from "../services/MediaService";
import { CreationNotis } from "../emails/emails";


export const add_media = async (req: Request, res: Response) => {

  try {

    const { title, content, rating, type } = req.body;
    const file = req.file;
    const ratingNum = Number(rating);
    var bucket = ""

    if (!file) return res.status(400).send("No file uploaded");

    console.log(type)
    if (type == "movie") {
      bucket = "grog_movie_banners"
    } else {
      bucket = "grog_game_banners"
    }

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    })

    await s3.send(command);

    const publicUrl = `${process.env.PUBLIC_URL}${bucket}/${file.originalname}`

    const { newMedia } = await mediaService.addMedia(title, content, ratingNum, type, publicUrl)

    console.log("calling creation notis")
    CreationNotis(`${type} review`, title).catch(err => {
      console.log("couldn't send emails out:", err)
    });

    res.json({ newMedia: newMedia })
    
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const get_media_types = async (req: Request, res: Response) => {
  try {
    const { type } = req.body;

    const media_types = await mediaService.getMediaTypes(type);

    return res.json({ media_types });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const like = async (req: Request, res: Response) => {
  try {
    const { postId, userId, type  } = req.body;

    const result = await mediaService.like(userId, postId, type);

    if (result.liked) {
      return res.status(200).json({ 
        message: "Like was successful!" 
      });
    } else {
      return res.status(200).json({ 
        message: "Unlike was successful!" 
      });
    }
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
}

export const checkLike = async (req: Request, res: Response) => {
  try {
    const {postId, userId, type } = req.body;

    const result = await mediaService.checkLike(userId, postId, type);

    if (result.liked) {
      return res.status(200).json({ 
        liked: true,
        likeCount: result.likedCount,
        message: "You liked this!" 
      });
    } else {
      return res.status(200).json({
        liked: false,
        likeCount: result.likedCount,
        message: "You didn't like this"
      })
    }
  } catch (e: any) {
    return res.status(500).json({ message: e.message })
  }
}


export const get_media_type = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; 

    const media = await mediaService.getMediaType(id);

    return res.json({ media });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const delete_media_type = async (req: Request, res: Response) => {
  try {
    const { id, mediaUrl, type } = req.body;
    var bucket = "";

    if (type == "movie") {
      bucket = "grog_movie_banners"
    } else {
      bucket = "grog_game_banners"
    }

    // Extract the file key from URL
    const fileKey = mediaUrl.split("/").pop(); // filename.png
    if (!fileKey) return res.status(400).json({ message: "Invalid movie URL" });

    // Delete from R2
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: fileKey,
      })
    );

    // Delete from DB
    const media = await mediaService.deleteMedia(id);

    return res.json({ message: "deleted media", media });

  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const edit_media_type = async (req: Request, res: Response) => {
  try {
    const { id, title, rating, content, type } = req.body;
    const newFile = req.file;
    var bucket = "";


    // Convert rating to number
    const ratingNum = Number(rating);
    if (isNaN(ratingNum)) {
      return res.status(400).json({ message: "Rating must be a number" });
    }

    if (type == "movie") {
      bucket = "grog_movie_banners"
    } else {
      bucket = "grog_game_banners"
    }

    // 1. Fetch existing movie
    const oldMedia = await mediaService.getMediaType(id);
    if (!oldMedia) {
      return res.status(404).json({ message: "Media not found" });
    }

    let bannerUrl = oldMedia.bannerUrl;

    // 2. Handle new banner upload
    if (newFile) {
      const oldFileKey = oldMedia.bannerUrl.split("/").pop();
      const newFileKey = newFile.originalname;

      if (oldFileKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: oldFileKey,
          })
        );
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: newFileKey,
          Body: newFile.buffer,
          ContentType: newFile.mimetype,
        })
      );

      bannerUrl = `${process.env.PUBLIC_URL}${bucket}/${newFileKey}`;
    }

    // 3. Update movie
    const updatedMedia = await mediaService.updateMedia(id, {
      title,
      content,
      rating: ratingNum,
      bannerUrl,
    });

    return res.json({ updatedMedia });

  } catch (e: any) {
    console.error("EDIT_MEDIA ERROR:", e);
    return res.status(500).json({ message: e.message || "Internal server error" });
  }
};





