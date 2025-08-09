import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Moon, Sun, Star, Sparkles, Heart, Home, Compass, Clock } from 'lucide-react';

interface CaveSection {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  theme: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    particle: string;
  };
  history: string;
  beauty: string;
  content: React.ReactNode;
}

const FlowingRiverInterface: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isFlowing, setIsFlowing] = useState(false);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Cave sections with unique histories and beauty
  const caveSections: CaveSection[] = [
    {
      id: 'entrance',
      title: 'The Mystic Entrance',
      subtitle: 'Where Your Journey Begins',
      icon: <Compass className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(30, 8%, 18%) 0%, hsl(30, 8%, 18%) 100%)',
        primary: 'hsl(180, 25%, 55%)',
        secondary: 'hsl(180, 25%, 55%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(180, 25%, 55%)'
      },
      history: 'Ancient seekers carved these walls over millennia, each leaving their cosmic wisdom for future travelers.',
      beauty: 'Starlight filters through crystal formations, creating dancing patterns of purple and silver.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-teal-200">Welcome, Cosmic Traveler</h3>
            <p className="text-teal-300 leading-relaxed">
              You stand at the threshold of an ancient cave system where time flows like water and wisdom 
              crystallizes in the walls. Each chamber ahead holds different energies and revelations.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-teal-900/30 border-yellow-600/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-teal-200">Ancient Wisdom</p>
              </CardContent>
            </Card>
            <Card className="bg-teal-900/30 border-yellow-600/30 backdrop-blur-md">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm text-teal-200">Cosmic Energy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'moonwell',
      title: 'The Moonwell Chamber',
      subtitle: 'Lunar Reflections & Dreams',
      icon: <Moon className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(200, 50%, 10%) 0%, hsl(220, 60%, 5%) 100%)',
        primary: 'hsl(180, 25%, 55%)',
        secondary: 'hsl(180, 25%, 55%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(180, 25%, 55%)'
      },
      history: 'Moon priestesses once gathered here during eclipses, channeling lunar energy into sacred pools.',
      beauty: 'Bioluminescent algae creates a gentle blue glow, while silver streams cascade from hidden springs.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-blue-200">Lunar Sanctuary</h3>
            <p className="text-blue-300 leading-relaxed">
              The moonwell reflects not just light, but dreams and intuitions. Ancient moon calendars 
              line the walls, showing the eternal dance between Earth and her celestial companion.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['🌙', '🌊', '✨'].map((emoji, idx) => (
              <div key={idx} className="text-center p-4 bg-blue-900/30 rounded-full border border-blue-500/30">
                <div className="text-2xl mb-2">{emoji}</div>
                <p className="text-xs text-blue-200">
                  {['Moon Phases', 'Sacred Waters', 'Dream Crystals'][idx]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'sunheart',
      title: 'The Sun Heart Cavern',
      subtitle: 'Solar Power & Life Force',
      icon: <Sun className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(30, 80%, 15%) 0%, hsl(20, 90%, 8%) 100%)',
        primary: 'hsl(44, 45%, 65%)',
        secondary: 'hsl(44, 45%, 65%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(44, 45%, 65%)'
      },
      history: 'Solar worshippers built golden altars here, harnessing the power of underground thermal vents.',
      beauty: 'Amber crystals glow with inner fire, while warm thermal springs create a nurturing embrace.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-amber-200">Solar Nexus</h3>
            <p className="text-amber-300 leading-relaxed">
              Even deep underground, solar energy flows through golden veins in the rock. This chamber 
              pulses with life force, warming both body and spirit with ancient fire.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full animate-ping opacity-30"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'lovegrotto',
      title: 'The Love Grotto',
      subtitle: 'Hearts Connected Across Time',
      icon: <Heart className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(30, 8%, 18%) 0%, hsl(30, 8%, 18%) 100%)',
        primary: 'hsl(180, 25%, 55%)',
        secondary: 'hsl(44, 45%, 65%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(180, 25%, 55%)'
      },
      history: 'Lovers carved eternal vows into rose quartz walls, creating a sanctuary of devoted hearts.',
      beauty: 'Pink crystals pulse with the rhythm of heartbeats, while love letters fossilized in stone tell timeless tales.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-pink-200">Chamber of Hearts</h3>
            <p className="text-pink-300 leading-relaxed">
              Love energy crystallized over centuries creates an atmosphere of pure connection. 
              Ancient couples blessed this space with their devotion, and their love still resonates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-pink-900/30 rounded-3xl border border-pink-500/30">
              <div className="text-3xl mb-2">💕</div>
              <p className="text-sm text-pink-200">Soul Bonds</p>
            </div>
            <div className="text-center p-4 bg-pink-900/30 rounded-3xl border border-pink-500/30">
              <div className="text-3xl mb-2">🌹</div>
              <p className="text-sm text-pink-200">Eternal Love</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'timechamber',
      title: 'The Time Chamber',
      subtitle: 'Past, Present & Future Converge',
      icon: <Clock className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(160, 40%, 10%) 0%, hsl(180, 50%, 5%) 100%)',
        primary: 'hsl(180, 25%, 55%)',
        secondary: 'hsl(180, 25%, 55%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(180, 25%, 55%)'
      },
      history: 'Time keepers built chronometers here, where temporal currents flow strongest in the cave system.',
      beauty: 'Hourglasses filled with stardust mark cosmic rhythms, while time crystals show glimpses of all moments.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-emerald-200">Temporal Nexus</h3>
            <p className="text-emerald-300 leading-relaxed">
              Time flows differently here, like honey through crystal formations. Past wisdom, 
              present awareness, and future possibilities swirl together in eternal dance.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Past', 'Present', 'Future'].map((time, idx) => (
              <div key={idx} className="text-center p-3 bg-emerald-900/30 rounded-2xl border border-emerald-500/30">
                <Clock className="h-6 w-6 mx-auto mb-2 text-emerald-400" />
                <p className="text-xs text-emerald-200">{time}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'sanctuary',
      title: 'The Inner Sanctuary',
      subtitle: 'Sacred Space of Transformation',
      icon: <Home className="h-8 w-8" />,
      theme: {
        background: 'linear-gradient(180deg, hsl(30, 8%, 18%) 0%, hsl(30, 8%, 18%) 100%)',
        primary: 'hsl(180, 25%, 55%)',
        secondary: 'hsl(180, 25%, 55%)',
        accent: 'hsl(60, 10%, 96%)',
        text: 'hsl(60, 10%, 96%)',
        particle: 'hsl(180, 25%, 55%)'
      },
      history: 'The deepest chamber where all energies converge, used for the most sacred transformational ceremonies.',
      beauty: 'All the colors of the previous chambers blend here in perfect harmony, creating aurora-like displays.',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-teal-200">Sacred Convergence</h3>
            <p className="text-teal-300 leading-relaxed">
              You have journeyed through all the chambers and now rest in the heart of the cave. 
              Here, all energies unite in perfect balance - moon and sun, love and time, past and future.
            </p>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 bg-gradient-conic from-yellow-600 via-pink-500 via-blue-500 via-emerald-500 to-amber-500 rounded-full animate-spin opacity-30" style={{ animationDuration: '20s' }}></div>
              <div className="absolute inset-4 bg-teal-900 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-teal-300" />
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const flowToSection = (index: number) => {
    setIsFlowing(true);
    setCurrentSection(index);
    
    if (sectionRefs.current[index]) {
      sectionRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    
    setTimeout(() => setIsFlowing(false), 1000);
  };

  const flowToNext = () => {
    if (currentSection < caveSections.length - 1) {
      flowToSection(currentSection + 1);
    }
  };

  // Create floating particles
  const createParticles = (color: string) => {
    return Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full opacity-70"
        style={{
          backgroundColor: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 2}s`
        }}
      />
    ));
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Cave Navigation River */}
      <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
        <div className="flex flex-col gap-3">
          {caveSections.map((section, index) => (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={`w-12 h-12 rounded-full transition-all duration-500 backdrop-blur-md border-2 ${
                currentSection === index 
                  ? 'scale-125 shadow-lg' 
                  : 'scale-100 opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: currentSection === index ? section.theme.primary + '40' : 'transparent',
                borderColor: section.theme.primary + '60',
                color: section.theme.primary
              }}
              onClick={() => flowToSection(index)}
            >
              {section.icon}
            </Button>
          ))}
        </div>
      </div>

      {/* Flowing Sections */}
      <div ref={sectionsRef} className="relative">
        {caveSections.map((section, index) => (
          <div
            key={section.id}
            ref={(el) => sectionRefs.current[index] = el}
            className="min-h-screen flex items-center justify-center relative overflow-hidden transition-all duration-1000"
            style={{ background: section.theme.background }}
          >
            {/* Floating Particles */}
            <div className="absolute inset-0 pointer-events-none">
              {createParticles(section.theme.particle)}
            </div>

            {/* River Flow Effect */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at center, ${section.theme.primary}20 0%, transparent 70%)`,
                animation: isFlowing ? 'wave 2s ease-in-out' : 'none'
              }}
            />

            {/* Section Content */}
            <div className="container mx-auto max-w-4xl px-6 relative z-10">
              <div className="text-center mb-8">
                <div 
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center border-4 backdrop-blur-md"
                  style={{ 
                    borderColor: section.theme.primary,
                    backgroundColor: section.theme.primary + '20',
                    color: section.theme.text
                  }}
                >
                  {section.icon}
                </div>
                
                <h1 
                  className="text-4xl md:text-6xl font-bold mb-4"
                  style={{ color: section.theme.text }}
                >
                  {section.title}
                </h1>
                
                <p 
                  className="text-xl mb-8"
                  style={{ color: section.theme.secondary }}
                >
                  {section.subtitle}
                </p>
              </div>

              {/* Historical Context & Beauty */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card 
                  className="backdrop-blur-md border-0"
                  style={{ backgroundColor: section.theme.primary + '15' }}
                >
                  <CardHeader>
                    <CardTitle style={{ color: section.theme.text }}>Ancient History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p style={{ color: section.theme.secondary }}>
                      {section.history}
                    </p>
                  </CardContent>
                </Card>

                <Card 
                  className="backdrop-blur-md border-0"
                  style={{ backgroundColor: section.theme.primary + '15' }}
                >
                  <CardHeader>
                    <CardTitle style={{ color: section.theme.text }}>Natural Beauty</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p style={{ color: section.theme.secondary }}>
                      {section.beauty}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Section Specific Content */}
              <Card 
                className="backdrop-blur-md border-0 mb-8"
                style={{ backgroundColor: section.theme.primary + '10' }}
              >
                <CardContent className="p-8">
                  {section.content}
                </CardContent>
              </Card>

              {/* Flow Control */}
              {index < caveSections.length - 1 && (
                <div className="text-center">
                  <Button
                    onClick={flowToNext}
                    className="rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: section.theme.primary,
                      color: section.theme.background,
                      boxShadow: `0 4px 20px ${section.theme.primary}40`
                    }}
                  >
                    <span className="mr-2">Flow Deeper</span>
                    <ChevronDown className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlowingRiverInterface;