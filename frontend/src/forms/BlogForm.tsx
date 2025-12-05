import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { blogFormSchema } from "@/validation/valSchema";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export const BlogForm = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof blogFormSchema>>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      content: "",
      banner: undefined,
    },
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  const onSubmit = async (values: z.infer<typeof blogFormSchema>) => {
    console.log(values);
    try {
        const formData = new FormData();

        formData.append("title", values.title)
        formData.append("content", values.content)
        if (values.banner && values.banner.length > 0) {
            formData.append("banner", values.banner[0]);
        }


      const response = await fetch(`${apiUrl}/blogs/add_blog`, {
        method: "POST", // typically sign-in is POST
        credentials: "include",
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      navigate("/")
    } catch (error) {
      console.error("There was an error fetching the data:", error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Input placeholder="Title" {...form.register("title")} required />
          <Input placeholder="Content" {...form.register("content")} required />
          <input
            type="file"
            {...form.register("banner")}
            accept="image/*"
            />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
};
