import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from 'react-markdown';
import { ArrowLeft } from "lucide-react";


type Blog = {
  id: number;
  title: string;
  content: string;
  bannerUrl: string;
  createdAt?: string;
};

export const BlogIdPage = () => {

  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>()
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setBlog(undefined)
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${apiUrl}/blogs/get_blog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                id: id,
            }),
        });

        const data = await response.json();

        setBlog(data.blog)
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchBlog();
  }, [id]);

  if (!blog) {
    return <div> Loading ... </div>
  }

  return (
    <>
        <div>
          <ArrowLeft 
            onClick={() => navigate(-1)} // goes back to previous page
            className="cursor-pointer"   // optional: show hand cursor
          />
        </div>
        <div className="max-w-full px-4">
            <h1 className="text-4xl font-bold mb-4 break-words">
              {blog.title}
            </h1>
            <div className="markdown prose max-w-none break-words overflow-hidden">
                <Markdown>{blog.content}</Markdown>
            </div>
        </div>

    </>
  );
};
