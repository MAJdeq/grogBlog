import type { Request, Response } from "express";
import {s3} from "../lib/blob";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import * as movieService from "../services/MovieService";


export const add_movie = async (req: Request, res: Response) => {

  try {

    const { title, content, rating } = req.body;
    const file = req.file;
    const ratingNum = Number(rating);

    if (!file) return res.status(400).send("No file uploaded");

    const command = new PutObjectCommand({
        Bucket: "grog_movie_banners",
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    })

    await s3.send(command);

    const publicUrl = `${process.env.PUBLIC_URL}grog_movie_banners/${file.originalname}`

    const { newMovie } = await movieService.addMovie(title, content, ratingNum, publicUrl)

    res.json({ newMovie: newMovie })
    
  } catch (e: any) {
    res.status(401).json({ message: e.message });
  }
};

export const get_movies = async (req: Request, res: Response) => {
  try {
    const movies = await movieService.getMovies();
    res.json({ movies })
  } catch (e: any) {
    res.status(401).json({ message: e.message })
  }
}

export const get_movie = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; 

    const movie = await movieService.getMovie(id);

    return res.json({ movie });
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const delete_movie = async (req: Request, res: Response) => {
  try {
    const { id, movieUrl } = req.body;

    // Extract the file key from URL
    const fileKey = movieUrl.split("/").pop(); // filename.png
    if (!fileKey) return res.status(400).json({ message: "Invalid blog URL" });

    // Delete from R2
    await s3.send(
      new DeleteObjectCommand({
        Bucket: "grog_blog_banners",
        Key: fileKey,
      })
    );

    // Delete from DB
    const movie = await movieService.deleteMovie(id);

    return res.json({ message: "deleted movie", movie });

  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

export const edit_movie = async (req: Request, res: Response) => {
  try {
    const { id, title, rating, content } = req.body;
    const newFile = req.file;

    // Convert rating to number
    const ratingNum = Number(rating);
    if (isNaN(ratingNum)) {
      return res.status(400).json({ message: "Rating must be a number" });
    }

    // 1. Fetch existing movie
    const newMovie = await movieService.getMovie(id);
    if (!newMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    let bannerUrl = newMovie.bannerUrl;

    // 2. Handle new banner upload
    if (newFile) {
      const oldFileKey = newMovie.bannerUrl.split("/").pop();
      const newFileKey = `${crypto.randomUUID()}-${newFile.originalname}`;

      if (oldFileKey) {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: "grog_movie_banners",
            Key: oldFileKey,
          })
        );
      }

      await s3.send(
        new PutObjectCommand({
          Bucket: "grog_movie_banners",
          Key: newFileKey,
          Body: newFile.buffer,
          ContentType: newFile.mimetype,
        })
      );

      bannerUrl = `${process.env.PUBLIC_URL}grog_movie_banners/${newFileKey}`;
    }

    // 3. Update movie
    const updatedMovie = await movieService.updateMovie(id, {
      title,
      content,
      rating: ratingNum,
      bannerUrl,
    });

    return res.json({ updatedMovie });

  } catch (e: any) {
    console.error("EDIT_MOVIE ERROR:", e);
    return res.status(500).json({ message: e.message || "Internal server error" });
  }
};





