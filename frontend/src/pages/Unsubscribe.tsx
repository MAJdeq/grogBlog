import { useUserStore } from "@/stores/AuthStore";
import { useEffect } from "react";
import { toast } from "sonner";

export const Unsubscribe = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { user, setSubscriber, subscriberToken, setSubscriberToken } = useUserStore();

  useEffect(() => {

    const unsubscribe = async () => {
      try {
        const res = await fetch(`${apiUrl}/subscribers/unsubscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.userId, token: subscriberToken }),
        });
        
        const data = await res.json();

        if (!res.ok) {
          toast(data.message || "Unsubscribe failed");
          return;
        }

        setSubscriber(false);
        setSubscriberToken("");

        toast(data.message || "Successfully unsubscribed");
      } catch (err) {
        console.error("Unsubscribe failed", err);
        toast("Something went wrong");
      }
    };

    unsubscribe();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-base sm:text-lg md:text-xl">
        You have been unsubscribed.
      </p>
    </div>
  );
};
