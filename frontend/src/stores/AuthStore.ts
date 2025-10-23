import { create } from "zustand";
import { persist } from "zustand/middleware";

// 1️⃣ Define the store interface
interface AdminState {
  authorized: boolean;
  setAuthorized: (val: boolean) => void;
}

// 2️⃣ Create the store with generic type applied
export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      authorized: false,
      setAuthorized: (val: boolean) => set({ authorized: val }),
    }),
    { name: "admin-store" }
  )
);
