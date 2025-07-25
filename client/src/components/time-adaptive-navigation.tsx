import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Menu, X, Clock, Moon, Sun, Sunrise, Sunset, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTimeOfDay, getTimeBasedTheme } from '@/lib/time-interface';
import { CookieManager } from '@/lib/cookie-manager';

export default function TimeAdaptiveNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(getTimeBasedTheme());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setTheme(getTimeBasedTheme());
    }, 60000);

    // Get visit count
    const prefs = CookieManager.getPreferences();
    setVisitCount(prefs.visitCount);

    return () => clearInterval(interval);
  }, []);

  const timeOfDay = getTimeOfDay();
  const timeIcon = {
    dawn: <Sunrise className="h-4 w-4" />,
    morning: <Sun className="h-4 w-4" />,
    afternoon: <Sun className="h-4 w-4" />,
    evening: <Sunset className="h-4 w-4" />,
    night: <Moon className="h-4 w-4" />,
    midnight: <Star className="h-4 w-4" />
  }[timeOfDay];

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/cosmic-time', label: 'Cosmic Time', icon: '⏰' },
    { href: '/enhanced-demo', label: 'Enhanced UI', icon: '🎨' },
    { href: '/birth-form', label: 'Analysis', icon: '📋' },
    { href: '/chart', label: 'Chart', icon: '🔮' },
    { href: '/compatibility', label: 'Love', icon: '💕' },
    { href: '/daily', label: 'Daily', icon: '📅' },
    { href: '/ai-assistant', label: 'AI Guide', icon: '🤖' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{ 
        background: `linear-gradient(90deg, ${theme.card}, ${theme.card}90)`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.primary}30`
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Time Indicator */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group-hover:scale-110"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 20px ${theme.primary}40`
              }}
            >
              {timeIcon}
            </div>
            <div>
              <h1 
                className="text-xl font-bold transition-colors"
                style={{ color: theme.text }}
              >
                Torchlight
              </h1>
              <div 
                className="text-xs flex items-center gap-1"
                style={{ color: theme.secondary }}
              >
                <Clock className="h-3 w-3" />
                {timeOfDay} mode
              </div>
            </div>
          </Link>

          {/* Time & Visit Status */}
          <div className="hidden md:flex items-center space-x-4">
            <Badge 
              variant="outline"
              className="px-3 py-1 transition-all duration-300 hover:scale-105"
              style={{ 
                borderColor: theme.primary,
                color: theme.primary,
                backgroundColor: theme.primary + '10'
              }}
            >
              {currentTime.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Badge>
            
            {visitCount > 0 && (
              <Badge 
                variant="outline"
                className="px-3 py-1"
                style={{ 
                  borderColor: theme.secondary,
                  color: theme.secondary,
                  backgroundColor: theme.secondary + '10'
                }}
              >
                Visit #{visitCount}
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-300 hover:scale-105"
                  style={{ 
                    color: theme.text,
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.primary + '20';
                    e.currentTarget.style.color = theme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.text;
                  }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            style={{ color: theme.text }}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            className="lg:hidden py-4 animate-in slide-in-from-top duration-300"
            style={{ 
              borderTop: `1px solid ${theme.primary}30`,
              background: theme.card + 'f0'
            }}
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                    style={{ color: theme.text }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.primary + '20';
                      e.currentTarget.style.color = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.text;
                    }}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
            
            {/* Mobile Time Display */}
            <div className="mt-4 pt-4 border-t border-opacity-20" style={{ borderColor: theme.primary }}>
              <div className="flex justify-center items-center gap-4">
                <Badge 
                  style={{ 
                    backgroundColor: theme.primary + '20',
                    color: theme.primary,
                    border: `1px solid ${theme.primary}`
                  }}
                >
                  {currentTime.toLocaleTimeString()}
                </Badge>
                <Badge 
                  style={{ 
                    backgroundColor: theme.secondary + '20',
                    color: theme.secondary,
                    border: `1px solid ${theme.secondary}`
                  }}
                >
                  {timeOfDay} energy
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}