import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: string;
  email: string;
  name: string;
  role: string;
}

// 1️⃣ Define the store interface
export interface UserState {
  authorized: boolean;
  user: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isAuthor: boolean;
  isSubscriber: boolean;
  subscriberToken: string;
  setSubscriber: (val: boolean) => void;
  setSubscriberToken: (val: string) => void;
  setUser: (userData: User) => void;
  setAdmin: (val: boolean) => void;
  setSuperAdmin: (val: boolean) => void;
  setAuthor: (val: boolean) => void;
  setAuthorized: (val: boolean) => void;
}

// 2️⃣ Create the store with generic type applied
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      authorized: false,
      user: {
        userId: "",
        email: "",
        name: "",
        role: "",
      },
      isAdmin: false,
      isSuperAdmin: false,
      isSubscriber: false,
      isAuthor: false,
      setSubscriber: (val: boolean) => set({ isSubscriber: val }),
      subscriberToken: "",
      setSubscriberToken: (val: string) => set({ subscriberToken: val}),
      setAdmin: (val: boolean) => set({ isAdmin: val}),
      setSuperAdmin: (val: boolean) => set({ isSuperAdmin: val}),
      setUser: (userData: User) => set({ user: userData}),
      setAuthor: (val: boolean) => set({ isAuthor: val }),
      setAuthorized: (val: boolean) => set({ authorized: val }),
    }),
    { name: "user-store" }
  )
);
