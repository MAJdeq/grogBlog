import * as z from "zod";

export const signInForm = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const signUpForm = z.object({
  email: z.email(),
  name: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});


export const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  banner: z
    .instanceof(File)
    .nullable()
    .optional(),
});

export const mediaFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
    banner: z
    .instanceof(File)
    .nullable()
    .optional(),
  rating: z.number().min(0).max(10),
  type: z.enum(["movie", "game"]),});


  export type Media = {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  type: string;
  rating: number,
  createdAt?: string;
};


export interface MediaComponentProps {
    type: "movie" | "game" | undefined;
}