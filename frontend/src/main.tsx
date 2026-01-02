import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavLayout } from "./layouts/NavLayout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BlogsPage } from "./pages/BlogsPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { DashLayout } from "./layouts/DashLayout.tsx";
import { AdminForm } from "./forms/AdminForm.tsx";
import { BlogIdPage } from "./pages/BlogIdPage.tsx";
import { MediaListPage } from "./pages/MediaPage.tsx";
import { MediaDetailPage } from "./pages/MediaIdPage.tsx";

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
          { path: "blog/:id", element: <BlogIdPage />},
          { path: "movie_reviews", element: <MediaListPage type = "movie" />}, 
          { path: "movie_reviews/:id", element: <MediaDetailPage type="movie" />},
          { path: "game_reviews", element: <MediaListPage type = "game"  />}, 
          { path: "game_reviews/:id", element: <MediaDetailPage type="game" />}
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
