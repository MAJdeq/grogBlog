import { useAdminStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MediaForm } from "@/forms/MediaForm";

type Game = {
  id: string;
  title: string;
  content: string;
  bannerUrl: string;
  type: string;
  rating: number,
  createdAt?: string;
};

export const GamesPage = () => {
  const { authorized } = useAdminStore();
  const [addGameOpen, setAddGameOpen] = useState(false);
  const [editGameOpen, setEditGameOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null);
  const type = "game";

  const [games, setGames] = useState<Game[]>([]);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleDelete = async (id: string, mediaUrl: string) => {
    try {
      const response = await fetch(`${apiUrl}/media/delete_media_type/?type="game"`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id, mediaUrl, type }),
      });

      if (!response.ok) {
        console.error("Something went wrong when deleting this blog...");
        return;
      }

      // <-- You need this to update the UI
      setGames((prev) => prev.filter((game) => game.id !== id));

    } catch (err) {
      console.error("Network or auth check error: ", err);
    }
  };



  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${apiUrl}/media/get_media_types`, {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ type: type }),
        });

        if (!response.ok) {
          console.error("Something went wrong when fetching movies...");
          return;
        }

        const data = await response.json();
        setGames(data.media_types);
      } catch (err) {
        console.error("Network or auth check error:", err);
      }
    };

    fetchGames();
  }, []);
  

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Game Reviews
      </h1>
      {games.length > 0 && (
        <div className="space-y-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="relative flex flex-col md:flex-row gap-4 p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Mobile Date (above image) */}
              <span className="block md:hidden text-xs text-gray-400 mb-2">
                {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : "No Date"}
              </span>


              {/* Left Column (Image) */}
              <div className="flex-shrink-0 w-full md:w-48 h-48 md:h-32">
                <img
                  src={game.bannerUrl}
                  alt={game.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col">
                {/* Desktop Date (optional: can go next to title or above) */}
                <span className="hidden md:block self-end text-xs text-gray-400 mb-1">
                  {game.createdAt ? new Date(game.createdAt).toLocaleDateString() : "No Date"}
                </span>

                {/* Title + Author */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <h2 className="text-xl font-semibold text-gray-900 break-words">
                    {game.title}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/movie_reviews/${game.id}`)}
                  >
                    Open
                  </Button>
                  {authorized && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setGameToEdit(game);
                          setEditGameOpen(true);
                        }}
                      >
                        Edit Game
                      </Button>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(game.id, game.bannerUrl)}
                      >
                        Delete Game
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
          <Button onClick={() => setAddGameOpen(true)}>Add Game</Button>
        </div>
      )}

      {/* Dialog */}
      <Dialog open={addGameOpen} onOpenChange={setAddGameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Game</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new game
            </DialogDescription>
          </DialogHeader>

          <MediaForm type="game" />
        </DialogContent>
      </Dialog>

      <Dialog open={editGameOpen} onOpenChange={setEditGameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit a Game</DialogTitle>
            <DialogDescription>
              Edit the form below to edit the game
            </DialogDescription>
          </DialogHeader>

          <MediaForm
            mode="edit"
            type="game"
            media={gameToEdit}
            onSuccess={(updatedGame: Game) => {
              // update UI after edit
              setGames(prev =>
                prev.map((b) =>
                  b.id === updatedGame.id ? updatedGame : b
                )
              );
              setEditGameOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
