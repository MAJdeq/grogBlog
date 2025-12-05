import * as z from "zod";

export const adminFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});


export const blogFormSchema = z.object({
  title: z.string(),
  content: z.string(),
  banner: z
    .any()
    .refine((file) => file instanceof FileList && file.length > 0, "Banner is required")
    .optional(), // if not required
});