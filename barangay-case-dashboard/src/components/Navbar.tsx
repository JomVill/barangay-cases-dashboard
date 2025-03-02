import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, FileText, Home, Menu, PieChart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-4 w-4" /> },
    { path: "/cases", label: "Cases", icon: <FileText className="h-4 w-4" /> },
    { path: "/analytics", label: "Analytics", icon: <PieChart className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => {
    // For the root path, check if pathname is exactly "/"
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "";
    }
    // For other paths, check if pathname starts with the path
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 overflow-hidden rounded-md bg-primary">
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary-foreground">
              B
            </div>
          </div>
          <span className="font-semibold">Barangay CMS</span>
        </Link>

        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="flex flex-col gap-4 px-2 py-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                      isActive(item.path)
                        ? "bg-secondary text-secondary-foreground font-medium"
                        : "hover:bg-secondary/80"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive(item.path)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-foreground" />
                )}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
