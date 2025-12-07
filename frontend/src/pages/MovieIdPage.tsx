import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Markdown from 'react-markdown';
import { ArrowLeft } from "lucide-react";


type Movie = {
  id: number;
  title: string;
  content: string;
  rating: number;
  bannerUrl: string;
  createdAt?: string;
};

export const MovieIdPage = () => {

  const { id } = useParams();
  const [movie, setMovie] = useState<Movie>()
  const navigate = useNavigate();
  
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setMovie(undefined)
    const fetchMovie = async () => {
      try {
        const response = await fetch(`${apiUrl}/movies/get_movie`, {
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

        setMovie(data.movie)
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return <div> Loading ... </div>
  }

  return (
    <>
        <ArrowLeft className="mb-4" onClick={() => navigate(-1)} />
        <div className="max-w-full px-4">
          <div className="flex gap-6 items-start md:flex-row flex-col">


            <div>
                <img 
                src={movie.bannerUrl} 
                alt="" 
                className="w-64 h-auto rounded-lg object-cover"
                />
                <div className="flex mt-3 text-lg font-semibold justify-center md:justify-end">
                    <span className="px-3 py-1 text-gray-800">
                        Rating: {movie.rating}/10
                    </span>
                </div>
            </div>

            {/* TEXT CONTENT */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4 break-words">
                {movie.title}
              </h1>

              <div className="markdown prose max-w-none break-words overflow-hidden">
                <Markdown>{movie.content}</Markdown>
              </div>
            </div>
          </div>
        </div>


    </>
  );
};
