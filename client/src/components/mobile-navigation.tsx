import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TorchlightLogo from "@/components/torchlight-logo";
import { Menu, Home, User, Heart, Gem, Star, Calendar } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navigationItems = [
    { href: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/personal", label: "Personal Chart", icon: <User className="w-5 h-5" /> },
    { href: "/compatibility", label: "Compatibility", icon: <Heart className="w-5 h-5" /> },
    { href: "/gemstone-energy-pairing", label: "Gemstones", icon: <Gem className="w-5 h-5" /> },
    { href: "/system-comparison", label: "Deep Analysis", icon: <Star className="w-5 h-5" /> },
    { href: "/business", label: "Career Insights", icon: <Calendar className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            <TorchlightLogo className="w-8 h-8" />
            <span className="text-white font-semibold text-lg">Torchlight</span>
          </div>
        </Link>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="right" 
            className="w-80 bg-gradient-to-b from-slate-900/95 to-slate-800/95 border-white/20 backdrop-blur-md"
          >
            <div className="pt-6">
              {/* Header */}
              <div className="text-center mb-8">
                <TorchlightLogo className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-white text-xl font-semibold">Torchlight</h2>
                <p className="text-white/60 text-sm">Your cosmic guidance</p>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left h-12 ${
                        location === item.href 
                          ? 'bg-teal-600/20 text-teal-300 border border-teal-500/30' 
                          : 'text-white hover:bg-white/10'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="text-center">
                  <p className="text-white/60 text-xs mb-2">
                    Western, Vedic, Chinese & Human Design
                  </p>
                  <p className="text-white/40 text-xs">
                    Free forever • AI-enhanced insights
                  </p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}