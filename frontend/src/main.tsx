import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavLayout } from "./layouts/NavLayout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BlogsPage } from "./pages/BlogsPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { DashLayout } from "./layouts/DashLayout.tsx";
import { AdminForm } from "./forms/AdminForm.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavLayout />,
    children: [
      {
        element: <DashLayout />,
        children: [
          { index: true, element: <HomePage /> }, // <-- this is now the default
          { path: "blogs", element: <BlogsPage /> },
        ],
      },
    ],
  },
  { path: "/admin_login", element: <AdminForm /> },
]);




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
