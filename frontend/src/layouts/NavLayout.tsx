import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAdminStore } from "../stores/AuthStore";
import { Button } from "../components/ui/button";
export const NavLayout = () => {
  const links = [
    {
      path: "home",
      name: "Home",
    },
    {
      path: "blogs",
      name: "Blogs",
    },
  ];
  const { authorized, setAuthorized } = useAdminStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
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
        setAuthorized(true);
      } catch (err) {
        console.error("Network or auth check error:", err);
        setAuthorized(false);
      }
    };

    checkAuth();
  }, [setAuthorized]);

  const handleLogout = async () => {
    const response = await fetch("http://localhost:5000/auth/sign_out", {
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
    }
  };

  return (
    <>
      <div className="bg-background mx-10 lg:max-w-5xl lg:mx-auto pt-10 lg:pt-40">
        {/* NAVBAR */}
        <div className="flex flex-initial items-center justify-between">
          <h1 className="text-3xl font-bold">GrogBlog</h1>
          <div className="flex">
            <nav className="hidden sm:flex items-center space-x-4">
              <NavigationMenu>
                <NavigationMenuList className="flex space-x-4">
                  {links.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink asChild>
                        <a href={`/${link.path}`}>{link.name}</a>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>

              {/* Logout button inline with links */}
              {authorized && <Button onClick={handleLogout}>Logout</Button>}
            </nav>

            <div className="block md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Menu />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {links.map((link) => (
                    <DropdownMenuItem>{link.name}</DropdownMenuItem>
                  ))}
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
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="/about" className="hover:underline">
                About
              </a>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
