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
import { MoviesPage } from "./pages/MoviesPage.tsx";
import { MovieIdPage } from "./pages/MovieIdPage.tsx"
import { GamesPage } from "./pages/GamesPage.tsx";
import { GameIdPage } from "./pages/GameIdPage.tsx";

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
          { path: "movie_reviews", element: <MoviesPage />}, 
          { path: "movie_reviews/:id", element: <MovieIdPage />},
          { path: "game_reviews", element: <GamesPage />}, 
          { path: "game_reviews/:id", element: <GameIdPage />}
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
