import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
export const NavLayout = () => {
  const {isAdmin} = useUserStore();
  const links = [
    {
      path: "/",
      name: "Home",
    },
    {
      path: "blogs",
      name: "Blogs",
    },
  ];

  if (isAdmin) {
    links.push({
      path: "dashboard",
      name: "Dashboard"
    })
  }
  
  const mediaLinks = [
    {
      path: "movie_reviews",
      name: "Movie Reviews"
    },
    {
      path: "game_reviews",
      name: "Game Reviews"
    }
  ]
  const navigate = useNavigate();
  const { authorized, setAuthorized, setAdmin } = useUserStore();
  const { user, setUser, isSubscriber, setSubscriber, setSubscriberToken, setAuthor } = useUserStore();
  const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          console.error(`HTTP ERROR! status ${response.status}`);
          setAuthorized(false);
          return;
        }

        const data = await response.json();
        console.log("Authorized user:", data.user);

        setAuthorized(true)

        setUser(data.user);
        console.log(data.user.role)
        if (data.user.role === "ADMIN") {
          setAdmin(true);
        } else if (data.user.role === "AUTHOR") {
          setAuthor(true);
        }

      } catch (err) {
        console.error("Network or auth check error:", err);
        setAuthorized(false);
      }
    };

    checkAuth();
  }, [setAuthorized]);

  const handleSubscriber = async () => {
    try {
      const response = await fetch(`${apiUrl}/subscribers/subscribe`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ id: user.userId, email: user.email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Subscription failed.");
        return;
      }

      const data = await response.json();

      console.log(data);

      setSubscriber(true);
      setSubscriberToken(data.token);
    
      toast.success("You have successfully subscribed!");

    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    }
  }

  const handleLogout = async () => {
    const response = await fetch(`${apiUrl}/auth/sign_out`, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`HTTP ERROR! status ${response.status}`);
    } else {
      setAuthorized(false);
      setAdmin(false);
      setUser({
        email: "",
        userId: "",
        name: "",
        role: ""
      });
      setAuthor(false);
    }
  };

  return (
    <>
      <div className="mx-10 lg:max-w-5xl lg:mx-auto pt-10 lg:pt-40">
        {/* NAVBAR */}
        <div className="flex flex-initial items-center justify-between">
          <h1 className="text-3xl font-bold">GrogBlog</h1>
          <div className="flex">
            <nav className="hidden sm:flex items-center space-x-4">
              <NavigationMenu>
                <NavigationMenuList className="flex-wrap">
                  {links.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink asChild>
                        <Link to={link.path}>{link.name}</Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}

                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Media</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {mediaLinks.map((link) => (
                          <NavigationMenuLink asChild>
                            <Link to={link.path}>{link.name}</Link>
                          </NavigationMenuLink>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {/* Logout button inline with links */}
              {authorized ? (
                <Button onClick={handleLogout}>Logout</Button>
              ): (
                <>
                  <Button onClick={() => navigate("/sign_in")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/sign_up")}>
                    Sign Up
                  </Button>
                </>
              )}
            </nav>

            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Menu />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {links.map((link, index) => (
                    <DropdownMenuItem key={index}>
                      <Link to={link.path} className="block w-full">
                        {link.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  {authorized && (
                    <>
                      <DropdownMenuItem>
                        <Button onClick={handleLogout}>
                          Logout
                        </Button>
                      </DropdownMenuItem>
                    </>
                  )}
    
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Outlet />
        <footer className="bg-gray-900 text-white py-6 mt-10">
          <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            <span className="text-sm">
              &copy; {new Date().getFullYear()} GrogBlog. All rights reserved.
            </span>

            {authorized && !isSubscriber && (
              <Button
                className="bg-ring"
                onClick={handleSubscriber}
              >
                Subscribe to Newsletter
              </Button>
            )}
          </div>
        </footer>


      </div>
    </>
  );
};
