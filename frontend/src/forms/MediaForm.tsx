import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mediaFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { capitalizeFirstLetter } from "@/lib/utils";
type Media = {
  id: string;
  title: string;
  content: string;
  type: string;
  rating: number,
  bannerUrl: string;
  createdAt?: string;
};

type MediaFormProps = {
  mode?: "add" | "edit";
  media?: Media | null;
  type?: "movie" | "game";
  onSuccess?: (updatedBlog: Media) => void;
};

export const MediaForm = ({ mode = "add", type, media, onSuccess }: MediaFormProps) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const form = useForm<z.infer<typeof mediaFormSchema>>({
    resolver: zodResolver(mediaFormSchema),
    defaultValues: {
      title: media?.title ?? "",
      rating: media?.rating ?? undefined, 
      content: media?.content ?? "",
      type: type,
      banner: undefined,
    },
  });

  // Pre-fill fields when editing (important)
  useEffect(() => {
    if (mode === "edit" && media) {
      form.setValue("title", media.title);
      form.setValue("content", media.content);
      form.setValue("rating", media.rating);
    }
  }, [media, mode, form]);

  const onSubmit = async (values: z.infer<typeof mediaFormSchema>) => {
    
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
      formData.append("type", values.type)
      
      // Always append banner if it exists
      if (values.banner) {
        formData.append("banner", values.banner);
      }
      
      if (mode === "edit" && media) {
        formData.append("id", media.id);
      }


      const endpoint =
        mode === "add" ? `${apiUrl}/media/add_media_type` : `${apiUrl}/media/edit_media_type`;
      const method: "POST" | "PUT" = mode === "add" ? "POST" : "PUT";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        body: formData,
      });


      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      
      if (mode === "add") navigate("/");
      else onSuccess?.(result.updatedMedia);
    } catch (err) {
      console.error("Movie form error:", err);
    }
  };

  useEffect(() => {
    if (type) {
      form.setValue("type", type);
    }
  }, [type, form]);


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

      <Textarea {...form.register("content")} />
      
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
      
      <Input type="hidden" {...form.register("type")}/>
      <Button type="submit" className="w-full">
        {mode === "add" ? `Add ${capitalizeFirstLetter(type)}` : "Save Changes"}
      </Button>
    </form>
  </div>
);
};
