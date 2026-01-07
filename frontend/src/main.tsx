import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavLayout } from "./layouts/NavLayout.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BlogsPage } from "./pages/BlogsPage.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { DashLayout } from "./layouts/DashLayout.tsx";
import { SignInForm } from "./forms/SignInForm.tsx";
import { SignUpForm } from "./forms/SignUpForm.tsx";
import { BlogIdPage } from "./pages/BlogIdPage.tsx";
import { MediaListPage } from "./pages/MediaListPage.tsx";
import { MediaDetailPage } from "./pages/MediaDetailPage.tsx";
import { Unsubscribe } from "./pages/Unsubscribe.tsx";
import { ProtectedDashboard } from "./guards/guards.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { PasswordResetFlow } from "./pages/PasswordResetFlow.tsx";

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
          { path: "game_reviews/:id", element: <MediaDetailPage type="game" />},
          {path: "unsubscribe", element: <Unsubscribe />},
          {path: "dashboard", element: <ProtectedDashboard />},
        ],
      },
    ],
  },
  { path: "/sign_in", element: <SignInForm /> },
  { path: "/sign_up", element: <SignUpForm />},
  { path: "/forgot_password", element: <PasswordResetFlow />}
]);




createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </StrictMode>
);
