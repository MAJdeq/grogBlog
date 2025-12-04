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
    path: "/",          // root path
    element: <NavLayout />,
    children: [
      {
        path: "/",      // nested layout path
        element: <DashLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "blogs", element: <BlogsPage /> },
        ],
      },
    ],
  },
  {
    path: "/admin_login",
    element: <AdminForm />,
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
