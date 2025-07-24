import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/chart", label: "Natal Charts" },
    { path: "/compatibility", label: "Compatibility" },
    { path: "/daily", label: "Daily Guidance" },
  ];

  return (
    <header className="relative z-50 bg-black/40 backdrop-blur-md border-b border-yellow-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 cosmic-gradient rounded-full cosmic-glow flex items-center justify-center">
              <span className="text-yellow-500 text-xl font-bold">☉</span>
            </div>
            <span className="text-xl font-serif font-semibold text-yellow-500">Torchlight</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors duration-300 ${
                  location === item.path
                    ? "text-yellow-500"
                    : "text-white hover:text-yellow-500"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-yellow-500">
              Sign In
            </Button>
            <Button className="cosmic-button">
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] cosmic-card border-yellow-500/20">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg transition-colors duration-300 ${
                      location === item.path
                        ? "text-yellow-500"
                        : "text-white hover:text-yellow-500"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Button variant="ghost" className="w-full text-white hover:text-yellow-500">
                    Sign In
                  </Button>
                  <Button className="w-full cosmic-button">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
