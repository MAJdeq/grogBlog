import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import type { Media } from "@/validation/valSchema";

type MediaDetailPageProps = {
  type: "game" | "movie";
};

export const MediaDetailPage = ({ type }: MediaDetailPageProps) => {
  const { id } = useParams();
  const [media, setMedia] = useState<Media | null>(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setMedia(null);

    const fetchMedia = async () => {
      try {
        const response = await fetch(`${apiUrl}/media/get_media_type`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id, type }),
        });

        const data = await response.json();
        setMedia(data.media);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMedia();
  }, [id, type]);

  if (!media) return <div>Loading...</div>;

  return (
    <>
      <ArrowLeft className="mb-4 cursor-pointer" onClick={() => navigate(-1)} />

      <div className="max-w-full px-4">
        <div className="flex gap-6 md:flex-row flex-col">
          <div>
            <img
              src={media.bannerUrl}
              className="w-64 rounded-lg object-cover"
            />
            <div className="mt-3 text-lg font-semibold text-center">
              Rating: {media.rating}/10
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">
              {media.title}
            </h1>

            <div className="prose max-w-none">
              <Markdown>{media.content}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
