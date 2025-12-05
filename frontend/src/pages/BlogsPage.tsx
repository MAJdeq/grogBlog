import { useAdminStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useEffect, useState } from "react";
import { BlogForm } from "../forms/BlogForm";

type Blog = {
  id: number;
  title: string;
  content: string;
  bannerUrl: string;
  createdAt?: string;
};

export const BlogsPage = () => {
  const { authorized } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/blogs/get_blogs`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Something went wrong when fetching blogs...");
          return;
        }

        const data = await response.json();
        setBlogs(data.blogs);
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {blogs.length > 0 && (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="relative flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Mobile Date (above image) */}
              <span className="block md:hidden text-xs text-gray-400 mb-2">
                {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "No Date"}
              </span>


              {/* Left Column (Image) */}
              <div className="flex-shrink-0 w-full md:w-48 h-48 md:h-32">
                <img
                  src={blog.bannerUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Desktop Date (optional: can go next to title or above) */}
                <span className="hidden md:block self-end text-xs text-gray-400 mb-1">
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "No Date"}
                </span>

                {/* Title + Author */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 break-words">
                    {blog.title}
                  </h2>
                </div>

                <div className="flex justify-end mt-auto">
                    <Button>
                      Open
                    </Button>
                  </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Blog Button (bottom of page) */}
      {authorized && (
        <div className="flex justify-center">
          <Button onClick={() => setOpen(true)}>Add Blog</Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Blog</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new blog post
            </DialogDescription>
          </DialogHeader>

          <BlogForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
