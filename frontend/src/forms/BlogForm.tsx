import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { blogFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { WordText } from "@/components/ui/shared/WordText";
import DOMPurify from 'dompurify';

type Blog = {
  id: string;
  title: string;
  authorId: string;
  content: string;
  bannerUrl: string;
  createdAt?: string;
};

type BlogFormProps = {
  mode?: "add" | "edit";
  blog?: Blog | null;
  onSuccess?: (updatedBlog: Blog) => void;
};

export const BlogForm = ({ mode = "add", blog, onSuccess }: BlogFormProps) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  
  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title ?? "",
      content: blog?.content ?? "",
      banner: undefined,
    },
  });

  useEffect(() => {
    if (mode === "edit" && blog) {
      form.setValue("title", blog.title);
      form.setValue("content", blog.content);
    }
  }, [blog, mode, form]);

  const onSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    try {
      if (mode === "add" && !values.banner) {
        alert("Please select a banner image.");
        return;
      }

      // Clean and sanitize the HTML content
      const cleanContent = DOMPurify.sanitize(values.content, {
        ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'u', 'ul', 'ol', 'li', 'span', 'div', 'strong', 'em'],
        ALLOWED_ATTR: ['style'],
        ALLOW_DATA_ATTR: false,
      });

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", cleanContent); // Use sanitized content
      
      if (values.banner) {
        formData.append("banner", values.banner);
      }
      
      if (mode === "edit" && blog) {
        formData.append("id", blog.id);
      }

      const endpoint =
        mode === "add" ? `${apiUrl}/blogs/add_blog` : `${apiUrl}/blogs/edit_blog`;
      const method: "POST" | "PUT" = mode === "add" ? "POST" : "PUT";
      
      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      
      if (mode === "add") navigate("/");
      else onSuccess?.(result.updatedBlog);
    } catch (err) {
      console.error("Blog form error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-4">
        <Input placeholder="Title" {...form.register("title")} required />
        
        <WordText 
          value={form.watch("content")}
          onChange={(value) => form.setValue("content", value, { shouldDirty: true })}
        />
        
        <div className="space-y-2">
          <label 
            htmlFor="banner-upload" 
            className="block text-sm font-medium text-gray-700"
          >
            Banner Image {mode === "add" && <span className="text-red-500">*</span>}
          </label>
          <Input
            id="banner-upload"
            type="file"
            accept="image/*"
            className="cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              form.setValue("banner", file, { shouldDirty: true });
              console.log("Banner selected:", file);
            }}
          />
        </div>
        
        <Button type="submit" className="w-full">
          {mode === "add" ? "Add Blog" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};