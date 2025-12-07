import { useAdminStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieForm } from "@/forms/MovieForm";

type Movie = {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  rating: number,
  createdAt?: string;
};

export const MoviesPage = () => {
  const { authorized } = useAdminStore();
  const [addMovieOpen, setAddMovieOpen] = useState(false);
  const [editMovieOpen, setEditMovieOpen] = useState(false);
  const [movieToEdit, setMovieToEdit] = useState<Movie | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleDelete = async (id: string, movieUrl: string) => {
    try {
      const response = await fetch(`${apiUrl}/movies/delete_movie/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, movieUrl }),
      });

      if (!response.ok) {
        console.error("Something went wrong when deleting this blog...");
        return;
      }

      // <-- You need this to update the UI
      setMovies((prev) => prev.filter((movie) => movie.id !== id));

    } catch (err) {
      console.error("Network or auth check error: ", err);
    }
  };



  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${apiUrl}/movies/get_movies`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Something went wrong when fetching movies...");
          return;
        }

        const data = await response.json();
        setMovies(data.movies);
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchMovies();
  }, []);
  

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Movie Reviews
      </h1>
      {movies.length > 0 && (
        <div className="space-y-4">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Mobile Date (above image) */}
              <span className="block md:hidden text-xs text-gray-400 mb-2">
                {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : "No Date"}
              </span>


              {/* Left Column (Image) */}
              <div className="flex-shrink-0 w-full md:w-48 h-48 md:h-32">
                <img
                  src={movie.bannerUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Desktop Date (optional: can go next to title or above) */}
                <span className="hidden md:block self-end text-xs text-gray-400 mb-1">
                  {movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : "No Date"}
                </span>

                {/* Title + Author */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 break-words">
                    {movie.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/movie_reviews/${movie.id}`)}
                  >
                    Open
                  </Button>
                  {authorized && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMovieToEdit(movie);
                          setEditMovieOpen(true);
                        }}
                      >
                        Edit Movie
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(movie.id, movie.bannerUrl)}
                      >
                        Delete Movie
                      </Button>
                    </>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Blog Button (bottom of page) */}
      {authorized && (
        <div className="flex justify-center">
          <Button onClick={() => setAddMovieOpen(true)}>Add Movie</Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={addMovieOpen} onOpenChange={setAddMovieOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Movie</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new movie
            </DialogDescription>
          </DialogHeader>

          <MovieForm />
        </DialogContent>
      </Dialog>

      <Dialog open={editMovieOpen} onOpenChange={setEditMovieOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit a Movie</DialogTitle>
            <DialogDescription>
              Edit the form below to edit the movie
            </DialogDescription>
          </DialogHeader>

          <MovieForm
            mode="edit"
            movie={movieToEdit}
            onSuccess={(updatedMovie: Movie) => {
              // update UI after edit
              setMovies(prev =>
                prev.map((b) =>
                  b.id === updatedMovie.id ? updatedMovie : b
                )
              );
              setEditMovieOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
