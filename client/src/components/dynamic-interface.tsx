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
        {/* Dynamic Header with Time-based Greeting */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl animate-pulse">{theme.cosmicElement}</div>
            <div>
              <h1 
                className="text-4xl md:text-6xl font-bold mb-2 animate-in slide-in-from-top duration-1000"
                style={{ color: theme.text }}
              >
                {personalizedGreeting}
              </h1>
              <div className="flex items-center justify-center gap-2 text-lg" style={{ color: theme.secondary }}>
                <Clock className="h-5 w-5" />
                <span>{currentTime.toLocaleTimeString()}</span>
                <Badge 
                  className="ml-2 px-3 py-1 transition-all duration-300 hover:scale-105"
                  style={{ 
                    backgroundColor: theme.accent + '30', 
                    color: theme.text,
                    border: `1px solid ${theme.accent}50`
                  }}
                >
                  {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Energy
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Visit Status Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <Badge 
              variant="outline" 
              className="transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              {visitStatus === 'first' ? '✨ First Visit' : 
               visitStatus === 'returning' ? '🌟 Welcome Back' : 
               '⭐ Cosmic Regular'}
            </Badge>
            <Badge 
              variant="outline"
              className="transition-all duration-300 hover:scale-105"
              style={{ borderColor: theme.secondary, color: theme.secondary }}
            >
              Visit #{userPrefs.visitCount}
            </Badge>
          </div>
        </div>

        {/* Daily Particulars Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Cosmic Weather */}
          <Card 
            className="cosmic-card time-card transition-all duration-500 cursor-pointer border-0 shadow-2xl"
            style={{ 
              backgroundColor: theme.card, 
              borderLeft: `4px solid ${theme.primary}`
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

          {/* Energy & Recommendations */}
          <Card 
            className="cosmic-card time-card transition-all duration-500 cursor-pointer border-0 shadow-2xl"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `4px solid ${theme.secondary}`
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

          {/* Lucky Elements */}
          <Card 
            className="cosmic-card time-card transition-all duration-500 cursor-pointer border-0 shadow-2xl"
            style={{ 
              backgroundColor: theme.card,
              borderLeft: `4px solid ${theme.accent}`
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
                      className="h-8 w-8 flex items-center justify-center rounded-full font-bold"
                      style={{ 
                        backgroundColor: theme.primary + '30', 
                        color: theme.primary,
                        border: `2px solid ${theme.primary}`
                      }}
                    >
                      {num}
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
                      className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-125"
                      style={{ 
                        backgroundColor: color,
                        borderColor: theme.text
                      }}
                      title={`Power color ${idx + 1}`}
                    />
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

        {/* Interactive Personalization Controls */}
        <Card 
          className="transition-all duration-500 border-0 shadow-2xl hover:shadow-3xl"
          style={{ 
            backgroundColor: theme.card,
            borderLeft: `4px solid ${theme.primary}`
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
                className="h-12 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 border-2"
                onClick={() => {
                  CookieManager.savePreferences({ personalizedGreeting: !userPrefs.personalizedGreeting });
                  setUserPrefs(CookieManager.getPreferences());
                  handleInteraction('toggle_personalized_greeting');
                }}
                style={{ 
                  borderColor: theme.primary,
                  color: userPrefs.personalizedGreeting ? '#ffffff' : theme.primary,
                  backgroundColor: userPrefs.personalizedGreeting ? theme.primary : 'transparent',
                  boxShadow: userPrefs.personalizedGreeting ? `0 4px 15px ${theme.primary}40` : 'none'
                }}
              >
                <span className="mr-2 text-lg">
                  {userPrefs.personalizedGreeting ? '✓' : '○'}
                </span>
                Personal Greetings
              </Button>
              
              <Button
                className="h-12 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 border-2"
                onClick={() => {
                  const newColors = dailyData.colors;
                  CookieManager.setFavoriteColors(newColors);
                  setUserPrefs(CookieManager.getPreferences());
                  handleInteraction('set_daily_colors', { colors: newColors });
                }}
                style={{ 
                  borderColor: theme.secondary,
                  color: theme.secondary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.secondary;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${theme.secondary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.secondary;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Palette className="mr-2 h-4 w-4" />
                Use Today's Colors
              </Button>
              
              <Button
                className="h-12 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 border-2"
                onClick={() => {
                  CookieManager.addPreferredSystem(`${timeOfDay}_system`);
                  handleInteraction('add_time_based_system', { time: timeOfDay });
                }}
                style={{ 
                  borderColor: theme.accent,
                  color: theme.accent,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.accent;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${theme.accent}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.accent;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Star className="mr-2 h-4 w-4" />
                Add {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Mode
              </Button>
              
              <Button
                className="h-12 px-4 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 border-2 group"
                onClick={() => {
                  setDailyData(getDailyParticulars());
                  setTheme(getTimeBasedTheme());
                  handleInteraction('refresh_cosmic_data');
                }}
                style={{ 
                  borderColor: theme.primary,
                  color: theme.primary,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.primary;
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${theme.primary}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.primary;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
                Refresh Cosmic Data
              </Button>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.primary + '30' }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text }}>
                Quick Actions
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="rounded-full px-4 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                  onClick={() => window.location.href = '/birth-form'}
                  style={{ 
                    backgroundColor: theme.primary + '20',
                    color: theme.primary,
                    border: `1px solid ${theme.primary}50`
                  }}
                >
                  🔮 Get Reading
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-4 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                  onClick={() => window.location.href = '/compatibility'}
                  style={{ 
                    backgroundColor: theme.secondary + '20',
                    color: theme.secondary,
                    border: `1px solid ${theme.secondary}50`
                  }}
                >
                  💕 Love Match
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-4 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                  onClick={() => window.location.href = '/daily'}
                  style={{ 
                    backgroundColor: theme.accent + '20',
                    color: theme.accent,
                    border: `1px solid ${theme.accent}50`
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