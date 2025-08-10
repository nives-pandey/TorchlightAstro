import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User, Heart, Music } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/lib/i18n";
import TorchlightLogo from "@/components/torchlight-logo";
import ThemeToggle from "@/components/theme-toggle";
import CosmicColorCustomizer from "@/components/cosmic-color-customizer";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", label: t('nav.home') },
    { path: "/personal", label: t('nav.personal') },
    { path: "/couples", label: t('nav.couples') },
    { path: "/spaces", label: t('nav.spaces') },
    { path: "/3d-chart", label: "🌌 3D Cosmos" },
    { path: "/gemstone-energy-pairing", label: "💎 Gemstone Energy" },
    { path: "/astral-soundtrack", label: "🎵 Astral Soundtrack" },
    { path: "/ai-assistant", label: t('nav.ai') },
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/sacred-energy-exchange", label: "✨ Sacred Exchange" },
    { path: "/about-astrology", label: t('nav.about') },
    { path: "/astrology-guide", label: "Systems Guide" },
  ];

  return (
    <header className="clean-nav fixed top-0 w-full z-50" style={{ backgroundColor: 'var(--nav-bg)', backdropFilter: 'blur(10px)' }}>
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-75 transition-opacity flex items-center">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col items-center justify-center">
                {/* Candle Icon */}
                <div className="relative">
                  {/* Star/Flame */}
                  <svg width="16" height="16" viewBox="0 0 16 16" className="text-yellow-400 mb-1">
                    <path d="M8 0 L10 6 L16 8 L10 10 L8 16 L6 10 L0 8 L6 6 Z" fill="currentColor" />
                  </svg>
                  {/* Candle Body */}
                  <div className="w-3 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-sm mx-auto"></div>
                </div>
              </div>
              {/* Text */}
              <span className="font-montserrat font-semibold text-lg tracking-tight" style={{ color: 'var(--nav-text)' }}>
                Torchlight
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location === item.path
                    ? "bg-yellow-600/20 text-yellow-500"
                    : "hover:text-yellow-500"
                }`}
                style={{ color: location === item.path ? undefined : 'var(--nav-text)' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Language Switcher & User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-3 p-3 bg-black/20 rounded-full backdrop-blur-sm">
              <ThemeToggle />
              <CosmicColorCustomizer />
              <Button 
                variant="outline" 
                size="sm"
                className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 border-4 border-white hover:border-red-600 transition-all duration-200 hover:scale-110 shadow-xl flex items-center justify-center p-0"
                style={{ 
                  backgroundColor: '#000000', 
                  borderColor: '#FFFFFF',
                  boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.5)'
                }}
                onClick={() => alert('Settings coming soon!')}
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </div>
            <LanguageSwitcher />
            
            {/* Contribution Button */}
            <Link href="/contribute">
              <Button 
                variant="ghost" 
                size="sm"
                className="bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-teal-700 hover:to-pink-700 text-white border-0 font-medium transition-all duration-200 hover:scale-105 shadow-md"
              >
                <Heart className="h-4 w-4 mr-1" />
                Support
              </Button>
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={(user as any)?.profileImageUrl || ""} alt={(user as any)?.firstName || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-yellow-600 text-white text-sm">
                      {(user as any)?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-slate-900 border border-yellow-500/50" align="end" forceMount>
                <DropdownMenuItem className="flex items-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">{(user as any)?.firstName} {(user as any)?.lastName}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('nav.signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden hover:bg-yellow-600/20 min-h-[44px] min-w-[44px] touch-manipulation" style={{ color: 'var(--nav-text)' }}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-slate-900/95 border-yellow-500/50 safe-top safe-bottom">
              <div className="flex flex-col space-y-2 mt-8 h-full overflow-y-auto swipeable">
                {/* Mobile Theme Toggle */}
                <div className="mb-4 p-4 border-b border-white/20 bg-black/30 rounded-lg">
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-white text-sm font-medium block mb-3">Color Controls</span>
                      <div className="flex items-center justify-center space-x-3">
                        <ThemeToggle />
                        <CosmicColorCustomizer />
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-12 h-12 rounded-full bg-black hover:bg-gray-800 border-4 border-white hover:border-red-600 transition-all duration-200 hover:scale-110 shadow-xl flex items-center justify-center p-0"
                          style={{ 
                            backgroundColor: '#000000', 
                            borderColor: '#FFFFFF',
                            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.5)'
                          }}
                          onClick={() => alert('Settings coming soon!')}
                        >
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`mobile-button text-left min-h-[48px] flex items-center transition-all duration-200 ${
                      location === item.path
                        ? "bg-yellow-600/30 text-teal-300 border-yellow-500"
                        : "text-white hover:bg-yellow-600/20"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-6 space-y-3">
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/api/logout'}
                    className="w-full justify-start px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
