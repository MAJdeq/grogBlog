import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  name: string;
  role: string;
}

// 1️⃣ Define the store interface
interface AdminState {
  authorized: boolean;
  user: User;
  setUser: (userData: User) => void;
  setAuthorized: (val: boolean) => void;
}

// 2️⃣ Create the store with generic type applied
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      authorized: false,
      user: {
        email: "",
        name: "",
        role: "",
      },
      setUser: (userData: User) => set({ user: userData}),
      setAuthorized: (val: boolean) => set({ authorized: val }),
    }),
    { name: "admin-store" }
  )
);
