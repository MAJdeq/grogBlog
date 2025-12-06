import * as z from "zod";

export const adminFormSchema = z.object({
  email: z.email(),
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