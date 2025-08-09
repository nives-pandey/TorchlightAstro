import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Moon, Sun, Calendar, Star, Sparkles, Eye, Palette } from 'lucide-react';
import { getTimeBasedTheme, getDailyParticulars, getTimeOfDay } from '@/lib/time-interface';
import { CookieManager } from '@/lib/cookie-manager';

export default function DynamicInterface() {
  const [theme, setTheme] = useState(getTimeBasedTheme());
  const [dailyData, setDailyData] = useState(getDailyParticulars());
  const [userPrefs, setUserPrefs] = useState(CookieManager.getPreferences());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();
      setCurrentTime(newTime);
      setTheme(getTimeBasedTheme());
      
      // Update daily data at midnight
      if (newTime.getHours() === 0 && newTime.getMinutes() === 0) {
        setDailyData(getDailyParticulars());
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Apply dynamic theme to document
    document.documentElement.style.setProperty('--dynamic-bg', theme.background);
    document.documentElement.style.setProperty('--dynamic-primary', theme.primary);
    document.documentElement.style.setProperty('--dynamic-card', theme.card);
    document.documentElement.style.setProperty('--dynamic-text', theme.text);
  }, [theme]);

  const handleInteraction = (action: string, data?: any) => {
    CookieManager.trackInteraction(action, data);
    CookieManager.savePreferences({ lastVisit: new Date().toISOString() });
  };

  const timeOfDay = getTimeOfDay();
  const personalizedGreeting = CookieManager.getPersonalizedGreeting();
  const visitStatus = CookieManager.getVisitStatus();

  return (
    <div 
      className="min-h-screen transition-all duration-1000 ease-in-out p-6"
      style={{ background: theme.background }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Dynamic Header with Curved Design */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-6 mb-6">
            <div 
              className="text-6xl cosmic-pulse relative p-4 rounded-full"
              style={{ 
                background: `radial-gradient(circle, ${theme.primary}20, transparent)`,
                animation: 'morph 8s ease-in-out infinite'
              }}
            >
              {theme.cosmicElement}
              <div 
                className="absolute inset-0 rounded-full opacity-30"
                style={{ 
                  background: `conic-gradient(from 0deg, ${theme.primary}, ${theme.secondary}, ${theme.accent}, ${theme.primary})`,
                  animation: 'spin 20s linear infinite'
                }}
              ></div>
            </div>
            <div>
              <h1 
                className="text-4xl md:text-6xl font-bold mb-2 animate-in slide-in-from-top duration-1000"
                style={{ 
                  color: theme.text,
                  textShadow: `0 0 20px ${theme.primary}40`,
                  background: `linear-gradient(135deg, ${theme.text}, ${theme.primary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {personalizedGreeting}
              </h1>
              <div className="flex items-center justify-center gap-3 text-lg" style={{ color: theme.secondary }}>
                <Clock className="h-5 w-5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
                <Badge 
                  className="ml-2 px-4 py-2 transition-all duration-500 hover:scale-110 cursor-pointer rounded-full"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.accent}40, ${theme.primary}20)`,
                    color: theme.text,
                    border: `2px solid ${theme.accent}60`,
                    backdropFilter: 'blur(10px)',
                    animation: 'morph 6s ease-in-out infinite'
                  }}
                >
                  {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Energy
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Curved Visit Status Indicators */}
          <div className="flex justify-center gap-3 mb-8">
            <Badge 
              className="px-6 py-2 transition-all duration-500 hover:scale-110 cursor-pointer rounded-full relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${theme.primary}30, ${theme.secondary}20)`,
                color: theme.primary,
                border: `2px solid ${theme.primary}50`,
                backdropFilter: 'blur(10px)',
                animation: 'morph 10s ease-in-out infinite'
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  background: `conic-gradient(from 45deg, ${theme.primary}, transparent, ${theme.primary})`,
                  animation: 'spin 15s linear infinite'
                }}
              ></div>
              <span className="relative z-10">
                {visitStatus === 'first' ? '✨ First Visit' : 
                 visitStatus === 'returning' ? '🌟 Welcome Back' : 
                 '⭐ Cosmic Regular'}
              </span>
            </Badge>
            <Badge 
              className="px-6 py-2 transition-all duration-500 hover:scale-110 cursor-pointer rounded-full relative overflow-hidden"
              style={{ 
                background: `linear-gradient(135deg, ${theme.secondary}30, ${theme.accent}20)`,
                color: theme.secondary,
                border: `2px solid ${theme.secondary}50`,
                backdropFilter: 'blur(10px)',
                animation: 'morph 12s ease-in-out infinite reverse'
              }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{ 
                  background: `radial-gradient(circle, ${theme.secondary}40, transparent)`,
                  animation: 'cosmic-pulse 4s ease-in-out infinite'
                }}
              ></div>
              <span className="relative z-10">Visit #{userPrefs.visitCount}</span>
            </Badge>
          </div>
        </div>

        {/* Daily Particulars Dashboard - Organic Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Today's Cosmic Weather - Flowing Organic Shape */}
          <Card 
            className="sanctuary-card time-card card-flow transition-all duration-500 cursor-pointer border-0 shadow-2xl rounded-organic"
            style={{ 
              backgroundColor: theme.card, 
              borderLeft: `6px solid ${theme.primary}`,
              borderRadius: '24px 32px 28px 20px',
              animation: 'morph 20s ease-in-out infinite'
            }}
            onClick={() => handleInteraction('view_daily_weather')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <Calendar className="h-5 w-5" style={{ color: theme.primary }} />
                Today's Cosmic Weather
              </CardTitle>
              <CardDescription style={{ color: theme.secondary }}>
                {dailyData.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text }}>Moon Phase:</span>
                <Badge style={{ backgroundColor: theme.primary + '20', color: theme.primary }}>
                  {dailyData.moonPhase}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text }}>Moon in:</span>
                <Badge style={{ backgroundColor: theme.secondary + '20', color: theme.secondary }}>
                  {dailyData.moonSign}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: theme.text }}>Element:</span>
                <Badge style={{ backgroundColor: theme.accent + '20', color: theme.accent }}>
                  {dailyData.dominantElement}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Energy & Recommendations - Curved Flowing Design */}
          <Card 
            className="sanctuary-card time-card card-flow transition-all duration-500 cursor-pointer border-0 shadow-2xl rounded-organic"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `6px solid ${theme.secondary}`,
              borderRadius: '32px 20px 30px 26px',
              animation: 'morph 25s ease-in-out infinite reverse'
            }}
            onClick={() => handleInteraction('view_energy_forecast')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <Sparkles className="h-5 w-5" style={{ color: theme.secondary }} />
                Energy Forecast
              </CardTitle>
              <CardDescription style={{ color: theme.secondary }}>
                Current cosmic influence level: {theme.energyLevel}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.primary }}>
                  Recommendation:
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                  {dailyData.recommendation}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.accent }}>
                  Best Activities:
                </h4>
                <p className="text-sm" style={{ color: theme.text }}>
                  {dailyData.bestTime}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Lucky Elements - Organic Morphing Shape */}
          <Card 
            className="sanctuary-card time-card card-flow transition-all duration-500 cursor-pointer border-0 shadow-2xl rounded-organic"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `6px solid ${theme.accent}`,
              borderRadius: '28px 24px 32px 22px',
              animation: 'morph 18s ease-in-out infinite'
            }}
            onClick={() => handleInteraction('view_lucky_elements')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <Star className="h-5 w-5" style={{ color: theme.accent }} />
                Lucky Elements
              </CardTitle>
              <CardDescription style={{ color: theme.secondary }}>
                Cosmic alignments for today
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.primary }}>
                  Lucky Numbers:
                </h4>
                <div className="flex gap-2">
                  {dailyData.luckyNumbers.map((num, idx) => (
                    <Badge 
                      key={idx}
                      className="h-10 w-10 flex items-center justify-center rounded-full font-bold transition-all duration-400 hover:scale-125 cursor-pointer relative overflow-hidden"
                      style={{ 
                        background: `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}20)`,
                        color: theme.primary,
                        border: `2px solid ${theme.primary}60`,
                        backdropFilter: 'blur(10px)',
                        animation: `morph ${8 + idx * 2}s ease-in-out infinite`
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}80, ${theme.secondary}60)`;
                        e.currentTarget.style.transform = 'scale(1.3) rotate(10deg)';
                        e.currentTarget.style.boxShadow = `0 5px 20px ${theme.primary}50`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}40, ${theme.secondary}20)`;
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <span className="relative z-10">{num}</span>
                      <div 
                        className="absolute inset-0 rounded-full opacity-30"
                        style={{ 
                          background: `conic-gradient(from ${idx * 120}deg, ${theme.primary}, transparent, ${theme.primary})`,
                          animation: 'spin 10s linear infinite'
                        }}
                      ></div>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2" style={{ color: theme.secondary }}>
                  Power Colors:
                </h4>
                <div className="flex gap-2">
                  {dailyData.colors.map((color, idx) => (
                    <div 
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 transition-all duration-400 hover:scale-150 cursor-pointer relative overflow-hidden"
                      style={{ 
                        backgroundColor: color,
                        borderColor: theme.text,
                        boxShadow: `0 0 15px ${color}50`,
                        animation: `cosmic-pulse ${3 + idx}s ease-in-out infinite`
                      }}
                      title={`Power color ${idx + 1}`}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.6) rotate(45deg)';
                        e.currentTarget.style.boxShadow = `0 0 25px ${color}80, 0 5px 15px rgba(0,0,0,0.3)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        e.currentTarget.style.boxShadow = `0 0 15px ${color}50`;
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full opacity-40"
                        style={{ 
                          background: `radial-gradient(circle, transparent 30%, ${color} 70%)`,
                          animation: 'cosmic-pulse 2s ease-in-out infinite'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cosmic Warning & Energy Description */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="transition-all duration-500 hover:scale-105 border-0 shadow-2xl"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `4px solid ${theme.primary}`
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <Eye className="h-5 w-5" style={{ color: theme.primary }} />
                Cosmic Awareness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                ⚠️ {dailyData.warning}
              </p>
            </CardContent>
          </Card>

          <Card 
            className="transition-all duration-500 hover:scale-105 border-0 shadow-2xl"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `4px solid ${theme.secondary}`
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
                <Moon className="h-5 w-5" style={{ color: theme.secondary }} />
                Current Energy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                {dailyData.energy}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Personalization Controls - Flowing Design */}
        <Card 
          className="card-flow transition-all duration-500 border-0 shadow-2xl hover:shadow-3xl rounded-organic"
          style={{ 
            backgroundColor: theme.card,
            borderLeft: `6px solid ${theme.primary}`,
            borderRadius: '30px 20px 28px 25px',
            animation: 'morph 22s ease-in-out infinite'
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: theme.text }}>
              <Palette className="h-5 w-5 animate-pulse" style={{ color: theme.primary }} />
              Personalize Your Experience
            </CardTitle>
            <CardDescription style={{ color: theme.secondary }}>
              Interface adapts to time of day • Your preferences are saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="h-12 px-6 py-2 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95 border-2 relative overflow-hidden backdrop-blur-md"
                onClick={() => {
                  CookieManager.savePreferences({ personalizedGreeting: !userPrefs.personalizedGreeting });
                  setUserPrefs(CookieManager.getPreferences());
                  handleInteraction('toggle_personalized_greeting');
                }}
                style={{ 
                  borderColor: theme.primary,
                  color: userPrefs.personalizedGreeting ? '#ffffff' : theme.primary,
                  background: userPrefs.personalizedGreeting ? 
                    `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` : 
                    `linear-gradient(135deg, ${theme.primary}20, ${theme.secondary}10)`,
                  boxShadow: userPrefs.personalizedGreeting ? `0 8px 25px ${theme.primary}50` : 'none',
                  animation: 'morph 8s ease-in-out infinite'
                }}
              >
                <span className="mr-2 text-lg">
                  {userPrefs.personalizedGreeting ? '✓' : '○'}
                </span>
                Personal Greetings
              </Button>
              
              <Button
                className="h-12 px-6 py-2 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95 border-2 relative overflow-hidden backdrop-blur-md"
                onClick={() => {
                  const newColors = dailyData.colors;
                  CookieManager.setFavoriteColors(newColors);
                  setUserPrefs(CookieManager.getPreferences());
                  handleInteraction('set_daily_colors', { colors: newColors });
                }}
                style={{ 
                  borderColor: theme.secondary,
                  color: theme.secondary,
                  background: `linear-gradient(135deg, ${theme.secondary}15, ${theme.accent}10)`,
                  animation: 'morph 10s ease-in-out infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.secondary}, ${theme.accent})`;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${theme.secondary}50`;
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.secondary}15, ${theme.accent}10)`;
                  e.currentTarget.style.color = theme.secondary;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <Palette className="mr-2 h-4 w-4" />
                Use Today's Colors
              </Button>
              
              <Button
                className="h-12 px-6 py-2 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95 border-2 relative overflow-hidden backdrop-blur-md"
                onClick={() => {
                  CookieManager.addPreferredSystem(`${timeOfDay}_system`);
                  handleInteraction('add_time_based_system', { time: timeOfDay });
                }}
                style={{ 
                  borderColor: theme.accent,
                  color: theme.accent,
                  background: `linear-gradient(135deg, ${theme.accent}15, ${theme.primary}10)`,
                  animation: 'morph 12s ease-in-out infinite reverse'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${theme.accent}50`;
                  e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.accent}15, ${theme.primary}10)`;
                  e.currentTarget.style.color = theme.accent;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <Star className="mr-2 h-4 w-4" />
                Add {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Mode
              </Button>
              
              <Button
                className="h-12 px-6 py-2 rounded-full font-semibold transition-all duration-500 transform hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group relative overflow-hidden backdrop-blur-md"
                onClick={() => {
                  setDailyData(getDailyParticulars());
                  setTheme(getTimeBasedTheme());
                  handleInteraction('refresh_cosmic_data');
                }}
                style={{ 
                  borderColor: theme.primary,
                  color: theme.primary,
                  background: `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`,
                  animation: 'morph 6s ease-in-out infinite'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 8px 25px ${theme.primary}50`;
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-1deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}15, ${theme.secondary}10)`;
                  e.currentTarget.style.color = theme.primary;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                Refresh Cosmic Data
              </Button>
            </div>
            
            {/* Quick Action Buttons - Curved Separator */}
            <div className="mt-8 pt-6 relative" style={{ borderColor: theme.primary + '30' }}>
              <div 
                className="absolute top-0 left-0 right-0 h-px rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, transparent, ${theme.primary}60, transparent)`,
                  height: '2px'
                }}
              ></div>
              <h4 className="text-sm font-semibold mb-4 text-glow" style={{ color: theme.text }}>
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-400 hover:scale-110 relative overflow-hidden backdrop-blur-md"
                  onClick={() => window.location.href = '/birth-form'}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.primary}25, ${theme.secondary}15)`,
                    color: theme.primary,
                    border: `2px solid ${theme.primary}40`,
                    animation: 'morph 8s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}80, ${theme.secondary}60)`;
                    e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
                    e.currentTarget.style.boxShadow = `0 5px 20px ${theme.primary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}25, ${theme.secondary}15)`;
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔮 Get Reading
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-400 hover:scale-110 relative overflow-hidden backdrop-blur-md"
                  onClick={() => window.location.href = '/compatibility'}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.secondary}25, ${theme.accent}15)`,
                    color: theme.secondary,
                    border: `2px solid ${theme.secondary}40`,
                    animation: 'morph 10s ease-in-out infinite reverse'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.secondary}80, ${theme.accent}60)`;
                    e.currentTarget.style.transform = 'scale(1.1) rotate(2deg)';
                    e.currentTarget.style.boxShadow = `0 5px 20px ${theme.secondary}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.secondary}25, ${theme.accent}15)`;
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  💕 Love Match
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-6 py-2 text-sm font-medium transition-all duration-400 hover:scale-110 relative overflow-hidden backdrop-blur-md"
                  onClick={() => window.location.href = '/daily'}
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.accent}25, ${theme.primary}15)`,
                    color: theme.accent,
                    border: `2px solid ${theme.accent}40`,
                    animation: 'morph 12s ease-in-out infinite'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.accent}80, ${theme.primary}60)`;
                    e.currentTarget.style.transform = 'scale(1.1) rotate(-1deg)';
                    e.currentTarget.style.boxShadow = `0 5px 20px ${theme.accent}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${theme.accent}25, ${theme.primary}15)`;
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  📅 Daily Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}