import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/AuthStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaForm } from "@/forms/MediaForm";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { Media } from "@/validation/valSchema";

type MediaListPageProps = {
  type: "game" | "movie";
};

export const MediaListPage = ({ type }: MediaListPageProps) => {
  const { isAdmin, isSuperAdmin } = useUserStore();
  const [media, setMedia] = useState<Media[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [mediaToEdit, setMediaToEdit] = useState<Media | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const label = capitalizeFirstLetter(type);

  useEffect(() => {
    const fetchMedia = async () => {
      const res = await fetch(`${apiUrl}/media/get_media_types`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type }),
      });

      const data = await res.json();
      setMedia(data.media_types);
    };

    fetchMedia();
  }, [type]);

  const handleDelete = async (id: string, bannerUrl: string) => {
    await fetch(`${apiUrl}/media/delete_media_type/?type=${type}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, mediaUrl: bannerUrl, type }),
    });

    setMedia(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{label} Reviews</h1>

      {media.map(m => (
        <div key={m.id} className="p-4 border rounded-lg flex gap-4">
          <img src={m.bannerUrl} className="w-48 h-32 object-cover rounded" />

          <div className="flex-1 flex flex-col">
            <h2 className="text-xl font-semibold">{m.title}</h2>
            {m?.author?.name && (
                      <p className="text-sm text-gray-500 mt-1">
                        By {m.author.name}
                      </p>
                    )}

            <div className="mt-auto flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/${type}_reviews/${m.id}`)}
              >
                Open
              </Button>

              {isAdmin && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setMediaToEdit(m);
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(m.id, m.bannerUrl)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {isAdmin || isSuperAdmin && (
        <>
          <div className="flex justify-center">
            <Button onClick={() => setAddOpen(true)}>Add {label}</Button>
          </div>

          {/* Add */}
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {label}</DialogTitle>
              </DialogHeader>
              <MediaForm type={type} />
            </DialogContent>
          </Dialog>

          {/* Edit */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit {label}</DialogTitle>
              </DialogHeader>
              <MediaForm
                mode="edit"
                type={type}
                media={mediaToEdit}
                onSuccess={(updated) => {
                  setMedia(prev =>
                    prev.map(m => m.id === updated.id ? updated : m)
                  );
                  setEditOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          </>
        )}

    </div>
  );
};
