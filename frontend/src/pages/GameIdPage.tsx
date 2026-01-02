import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from 'react-markdown';
import { ArrowLeft } from "lucide-react";
import type { Media } from "@/validation/valSchema";


export const GameIdPage = () => {

  const { id } = useParams();
  const [media, setMedia] = useState<Media>()
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setMedia(undefined)
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${apiUrl}/media/get_media_type`, {
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

        setMedia(data.media)
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchMedia();
  }, [id]);

  if (!media) {
    return <div> Loading ... </div>
  }

  return (
    <>
        <ArrowLeft className="mb-4" onClick={() => navigate(-1)} />
        <div className="max-w-full px-4">
          <div className="flex gap-6 items-start md:flex-row flex-col">


            <div>
                <img 
                src={media.bannerUrl} 
                alt="" 
                className="w-64 h-auto rounded-lg object-cover"
                />
                <div className="flex mt-3 text-lg font-semibold justify-center md:justify-end">
                    <span className="px-3 py-1 text-gray-800">
                        Rating: {media.rating}/10
                    </span>
                </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 break-words">
                {media.title}
              </h1>

              <div className="markdown prose max-w-none break-words overflow-hidden">
                <Markdown>{media.content}</Markdown>
              </div>
            </div>
          </div>
        </div>


    </>
  );
};
