import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from "react-markdown";
import { ArrowLeft, HeartOff, Heart } from "lucide-react";
import type { Media } from "@/validation/valSchema";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserStore } from "@/stores/AuthStore";

type MediaDetailPageProps = {
  type: "game" | "movie";
};

export const MediaDetailPage = ({ type }: MediaDetailPageProps) => {
  const { id } = useParams();
  const { user } = useUserStore();
  const [media, setMedia] = useState<Media | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null); // null = not yet loaded
  const [likesCount, setLikesCount] = useState(0);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;


  const handleLikes = async () => {
    if (liked === null) return; // still loading

    const newLiked = !liked;

    // Optimistic update
    setLiked(newLiked);
    setLikesCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      const response = await fetch(`${apiUrl}/media/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: id, userId: user.userId, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.message || "Failed to toggle like");
        // revert optimistic update
        setLiked(!newLiked);
        setLikesCount((prev) => prev + (newLiked ? -1 : 1));
      }
    } catch (err) {
      console.error(err);
      // revert optimistic update
      setLiked(!newLiked);
      setLikesCount((prev) => prev + (newLiked ? -1 : 1));
    }
  };


  useEffect(() => {
    if (!user?.userId) return;

    let mounted = true;

    const fetchData = async () => {
      try {
        // Fetch media
        const mediaRes = await fetch(`${apiUrl}/media/get_media_type`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id, type }),
        });
        const mediaData = await mediaRes.json();

        // Fetch like status
        const likeRes = await fetch(`${apiUrl}/media/check_like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ postId: id, userId: user.userId, type }),
        });
        const likeData = await likeRes.json();

        if (mounted) {
          setMedia(mediaData.media);
          setLikesCount(likeData.likeCount)
          setLiked(likeData.liked);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => { mounted = false; };
  }, [id, type, user?.userId]);



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
            <div className="mb-4">
              <div className="flex justify-between">
                  <div>
                    <h1 className="text-4xl font-bold ">
                      {media.title}
                    </h1>
                    <p className="text-muted-foreground"> {likesCount} {likesCount === 1 ? "like": "likes"} </p>
                  </div>
                  <Button onClick={handleLikes} disabled={liked === null}>
                    {liked ? <Heart color="red" /> : <HeartOff />}
                  </Button>
              </div>
              
            </div>

            <div className="prose max-w-none">
              <Markdown>{media.content}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
