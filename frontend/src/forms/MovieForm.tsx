import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { movieFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

type Movie = {
  id: string;
  title: string;
  content: string;
  rating: number,
  bannerUrl: string;
  createdAt?: string;
};

type MovieFormProps = {
  mode?: "add" | "edit";
  movie?: Movie | null;
  onSuccess?: (updatedBlog: Movie) => void;
};

export const MovieForm = ({ mode = "add", movie, onSuccess }: MovieFormProps) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const form = useForm<z.infer<typeof movieFormSchema>>({
    resolver: zodResolver(movieFormSchema),
    defaultValues: {
      title: movie?.title ?? "",
      rating: movie?.rating ?? undefined,
      content: movie?.content ?? "",
      banner: undefined,
    },
  });

  // Pre-fill fields when editing (important)
  useEffect(() => {
    if (mode === "edit" && movie) {
      form.setValue("title", movie.title);
      form.setValue("content", movie.content);
      form.setValue("rating", movie.rating);
    }
  }, [movie, mode, form]);

  const onSubmit = async (values: z.infer<typeof movieFormSchema>) => {
    
    try {
      // Only require banner for adding
      if (mode === "add" && !values.banner) {
        alert("Please select a banner image.");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("rating", String(values.rating));
      formData.append("content", values.content);
      
      // Always append banner if it exists
      if (values.banner) {
        formData.append("banner", values.banner);
      }
      
      if (mode === "edit" && movie) {
        formData.append("id", movie.id);
      }


      const endpoint =
        mode === "add" ? `${apiUrl}/movies/add_movie` : `${apiUrl}/movies/edit_movie`;
      const method: "POST" | "PUT" = mode === "add" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
      });


      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      
      if (mode === "add") navigate("/");
      else onSuccess?.(result.updatedMovie);
    } catch (err) {
      console.error("Movie form error:", err);
    }
  };

  return (
  <div className="flex items-center justify-center p-4">
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-4">
      <Input placeholder="Title" {...form.register("title")} required />
        <Input
        type="number"
        placeholder="Rating"
        min={0}
        max={10}
        {...form.register("rating", { valueAsNumber: true })}
        required
        />

      <Textarea placeholder="Content" {...form.register("content")} required />
      
      {/* Styled File Upload */}
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
        {mode === "add" ? "Add Movie" : "Save Changes"}
      </Button>
    </form>
  </div>
);
};
