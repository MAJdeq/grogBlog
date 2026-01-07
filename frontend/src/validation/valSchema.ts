import * as z from "zod";

export const signInForm = z.object({
  email: z.string().email({ message: "Invalid email address" }),  
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
});

export const signUpForm = z.object({
  email: z.string().email({ message: "Invalid email address" }),  
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, or apostrophes"),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  isSubscriber: z.boolean()
});

export const requestOtpForm = z.object({
  email: z.string().email({ message: "Invalid email address" })
})

export const verifyOtpForm = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits") // enforce 6 characters
    .regex(/^\d+$/, "OTP must only contain numbers"), // optional: ensure only digits
});

export const resetPassword = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",  // <-- updated message
    path: ["confirmPassword"],        // points the error to confirmPassword field
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
  author?: {  // Add this
    id: string;
    name: string;
    email: string;
  };
  
};

export type Blog = {
  id: string;
  title: string;
  authorId: string;
  content: string;
  bannerUrl: string;
  createdAt?: string;
  author?: {  // Add this
    id: string;
    name: string;
    email: string;
  };
};

export interface MediaComponentProps {
    type: "movie" | "game" | undefined;
}