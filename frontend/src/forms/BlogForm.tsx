import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { blogFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

type Blog = {
  id: string;
  title: string;
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

  // Pre-fill fields when editing (important)
  useEffect(() => {
    if (mode === "edit" && blog) {
      form.setValue("title", blog.title);
      form.setValue("content", blog.content);
    }
  }, [blog, mode, form]);

  const onSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    try {
      // Require banner only for adding
      if (mode === "add" && (!values.banner || values.banner.length === 0)) {
        alert("Please select a banner image.");
        return; // stop submission
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);

      // Append file only if present (optional for edit)
      if (values.banner && values.banner.length > 0) {
        formData.append("banner", values.banner[0]);
      }

      let endpoint = "";
      let method: "POST" | "PUT" = "POST";

      if (mode === "add") {
        endpoint = `${apiUrl}/blogs/add_blog`;
        method = "POST";
      } else if (mode === "edit" && blog) {
        endpoint = `${apiUrl}/blogs/edit_blog`;
        method = "PUT";
        formData.append("id", blog.id);
      }

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (mode === "add") {
        navigate("/");
      } else if (mode === "edit") {
        onSuccess?.(result.updatedBlog);
      }

    } catch (error) {
      console.error("Blog form error:", error);
    }
  };


  return (
    <div className="flex items-center justify-center">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Title" {...form.register("title")} required />
        <Textarea placeholder="Content" {...form.register("content")} required />

        {/* File Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            form.setValue("banner", e.target.files?.[0]);
            console.log("File selected:", e.target.files?.[0]);
          }}
        />


        <Button type="submit">
          {mode === "add" ? "Add Blog" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};
