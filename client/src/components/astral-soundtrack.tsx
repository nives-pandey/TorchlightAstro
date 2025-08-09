import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Music, Play, Pause, Volume2, Heart, Download, Share2, Sparkles, Clock, Moon, Sun, Star, Home, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';

interface SoundtrackData {
  personalProfile: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    dominantElement: string;
    planetaryRuler: string;
    birthSeason: string;
    timeOfBirth: 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight';
  };
  currentTransits: {
    moonPhase: string;
    dominantPlanet: string;
    seasonalEnergy: string;
    cosmicWeather: string[];
  };
  musicProfile: {
    genres: string[];
    moods: string[];
    instruments: string[];
    tempos: string[];
    energyLevel: number;
    emotionalTone: string;
  };
  recommendations: {
    daily: Track[];
    meditation: Track[];
    energy: Track[];
    sleep: Track[];
    ritual: Track[];
  };
}

interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  astrologyMatch: number;
  planetaryAlignment: string[];
  elementalEnergy: string;
  description: string;
  energyLevel: number;
  timeOfDay: string[];
  audioUrl?: string;
  previewUrl?: string;
}

export default function AstralSoundtrack() {
  const [activePlaylist, setActivePlaylist] = useState<'daily' | 'meditation' | 'energy' | 'sleep' | 'ritual'>('daily');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [moodFilter, setMoodFilter] = useState<string>('all');

  // Mock data - in real implementation, this would come from birth data and current transits
  const mockSoundtrackData: SoundtrackData = {
    personalProfile: {
      sunSign: "Virgo",
      moonSign: "Pisces",
      risingSign: "Scorpio",
      dominantElement: "Water",
      planetaryRuler: "Mercury",
      birthSeason: "Late Summer",
      timeOfBirth: "dawn"
    },
    currentTransits: {
      moonPhase: "Waxing Crescent",
      dominantPlanet: "Venus",
      seasonalEnergy: "Winter Solstice",
      cosmicWeather: ["Mercury Retrograde", "Jupiter Trine"]
    },
    musicProfile: {
      genres: ["Ambient", "Neo-Classical", "Downtempo", "World Music"],
      moods: ["Contemplative", "Mystical", "Grounding", "Transformative"],
      instruments: ["Piano", "Strings", "Synthesizer", "Tibetan Bowls"],
      tempos: ["Slow", "Moderate"],
      energyLevel: 6,
      emotionalTone: "Introspective"
    },
    recommendations: {
      daily: [
        {
          id: "d1",
          title: "Mercury's Morning Dance",
          artist: "Cosmic Collective",
          genre: "Ambient Classical",
          duration: "4:32",
          astrologyMatch: 94,
          planetaryAlignment: ["Mercury", "Venus"],
          elementalEnergy: "Earth-Water",
          description: "Perfectly aligned with your Virgo-Pisces axis, enhancing analytical intuition",
          energyLevel: 6,
          timeOfDay: ["morning", "afternoon"],
          previewUrl: "https://example.com/preview1"
        },
        {
          id: "d2",
          title: "Scorpio Rising Meditation",
          artist: "Astral Harmonics",
          genre: "Transformative Ambient",
          duration: "6:18",
          astrologyMatch: 91,
          planetaryAlignment: ["Pluto", "Mars"],
          elementalEnergy: "Water-Fire",
          description: "Deep transformation music matching your Scorpio ascendant intensity",
          energyLevel: 7,
          timeOfDay: ["evening", "night"],
          previewUrl: "https://example.com/preview2"
        },
        {
          id: "d3",
          title: "Virgoan Precision Flow",
          artist: "Elemental Frequencies",
          genre: "Structured Ambient",
          duration: "5:44",
          astrologyMatch: 89,
          planetaryAlignment: ["Mercury", "Saturn"],
          elementalEnergy: "Earth",
          description: "Organized, methodical rhythms that resonate with your Virgo sun",
          energyLevel: 5,
          timeOfDay: ["morning", "afternoon"],
          previewUrl: "https://example.com/preview3"
        }
      ],
      meditation: [
        {
          id: "m1",
          title: "Piscean Depths",
          artist: "Ocean Mystics",
          genre: "Meditative Ambient",
          duration: "12:00",
          astrologyMatch: 96,
          planetaryAlignment: ["Neptune", "Moon"],
          elementalEnergy: "Water",
          description: "Deep oceanic frequencies matching your Pisces moon's emotional depths",
          energyLevel: 3,
          timeOfDay: ["evening", "night"],
          previewUrl: "https://example.com/meditation1"
        },
        {
          id: "m2",
          title: "Waxing Crescent Renewal",
          artist: "Lunar Soundscapes",
          genre: "Moon Phase Music",
          duration: "18:33",
          astrologyMatch: 93,
          planetaryAlignment: ["Moon"],
          elementalEnergy: "Water-Air",
          description: "Specially composed for current waxing crescent moon energy",
          energyLevel: 4,
          timeOfDay: ["night", "midnight"],
          previewUrl: "https://example.com/meditation2"
        }
      ],
      energy: [
        {
          id: "e1",
          title: "Martian Fire Activation",
          artist: "Planetary Pulse",
          genre: "Energetic Ambient",
          duration: "7:22",
          astrologyMatch: 87,
          planetaryAlignment: ["Mars", "Jupiter"],
          elementalEnergy: "Fire",
          description: "Ignite your inner fire with Mars-aligned frequencies",
          energyLevel: 9,
          timeOfDay: ["morning", "afternoon"],
          previewUrl: "https://example.com/energy1"
        }
      ],
      sleep: [
        {
          id: "s1",
          title: "Saturn's Gentle Embrace",
          artist: "Nocturnal Harmonies",
          genre: "Sleep Ambient",
          duration: "45:00",
          astrologyMatch: 92,
          planetaryAlignment: ["Saturn", "Moon"],
          elementalEnergy: "Earth-Water",
          description: "Deep, grounding frequencies for restorative sleep",
          energyLevel: 1,
          timeOfDay: ["night", "midnight"],
          previewUrl: "https://example.com/sleep1"
        }
      ],
      ritual: [
        {
          id: "r1",
          title: "Plutonian Transformation",
          artist: "Sacred Frequencies",
          genre: "Ritual Ambient",
          duration: "33:33",
          astrologyMatch: 95,
          planetaryAlignment: ["Pluto", "Scorpio"],
          elementalEnergy: "Water-Fire",
          description: "Powerful transformation music for deep spiritual work",
          energyLevel: 8,
          timeOfDay: ["evening", "midnight"],
          previewUrl: "https://example.com/ritual1"
        }
      ]
    }
  };

  const playlistData = {
    daily: { icon: Sun, title: "Daily Cosmic Flow", subtitle: "Personalized for your current energy" },
    meditation: { icon: Moon, title: "Meditative Journeys", subtitle: "Deep inner exploration" },
    energy: { icon: Sparkles, title: "Energy Activation", subtitle: "Boost your cosmic power" },
    sleep: { icon: Clock, title: "Celestial Sleep", subtitle: "Restorative night frequencies" },
    ritual: { icon: Star, title: "Sacred Rituals", subtitle: "Transformative ceremonies" }
  };

  const currentPlaylistTracks = mockSoundtrackData.recommendations[activePlaylist];
  const PlaylistIcon = playlistData[activePlaylist].icon;

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1]));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      'Fire': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Earth': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Air': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Water': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Earth-Water': 'bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Water-Fire': 'bg-gradient-to-r from-cyan-500/20 to-red-500/20 text-red-300 border-red-500/30',
      'Water-Air': 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-blue-300 border-blue-500/30'
    };
    return colors[element] || 'bg-yellow-600/20 text-teal-300 border-yellow-600/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-blue-900">
      <Navigation />
      <div className="pt-20 safe-top safe-bottom">
        <div className="mobile-container sm:max-w-7xl sm:mx-auto sm:px-6">
          {/* Back Navigation */}
          <div className="flex items-center gap-4 mb-6 px-4">
            <Link href="/">
              <Button variant="ghost" className="text-teal-300 hover:text-white hover:bg-yellow-600/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <h1 className="mobile-heading text-2xl sm:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Music className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />
            ✨ Astral Soundtrack Generator
          </h1>
          <p className="mobile-text text-teal-200 sm:text-lg">
            Personalized cosmic music aligned with your birth chart and current planetary transits
          </p>
        </div>

        {/* Astrological Profile Summary */}
        <Card className="mobile-card mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg sm:text-xl flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              Your Cosmic Music Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-teal-200">Astrological Foundation</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    ☉ {mockSoundtrackData.personalProfile.sunSign}
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    ☽ {mockSoundtrackData.personalProfile.moonSign}
                  </Badge>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                    ↗ {mockSoundtrackData.personalProfile.risingSign}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-teal-200">Current Cosmic Weather</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-600/20 text-teal-300 border-yellow-600/30">
                    {mockSoundtrackData.currentTransits.moonPhase}
                  </Badge>
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    {mockSoundtrackData.currentTransits.dominantPlanet} Energy
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-teal-200">Musical Elements</p>
                <div className="flex flex-wrap gap-2">
                  {mockSoundtrackData.musicProfile.genres.slice(0, 2).map(genre => (
                    <Badge key={genre} className="bg-green-500/20 text-green-300 border-green-500/30">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-teal-200">Current Energy Level</span>
                <span className="text-white">{mockSoundtrackData.musicProfile.energyLevel}/10</span>
              </div>
              <Progress 
                value={mockSoundtrackData.musicProfile.energyLevel * 10} 
                className="h-2 bg-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Music Player */}
        {currentTrack && (
          <Card className="mobile-card mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  onClick={togglePlayPause}
                  className="mobile-button w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-yellow-600 to-pink-600 hover:from-teal-700 hover:to-pink-700 text-white"
                >
                  {isPlaying ? <Pause className="h-5 w-5 sm:h-6 sm:w-6" /> : <Play className="h-5 w-5 sm:h-6 sm:w-6" />}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate text-sm sm:text-base">{currentTrack.title}</h3>
                  <p className="text-teal-200 text-xs sm:text-sm truncate">{currentTrack.artist}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs ${getElementColor(currentTrack.elementalEnergy)}`}>
                      {currentTrack.elementalEnergy}
                    </Badge>
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                      {currentTrack.astrologyMatch}% Match
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-teal-300" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-16 sm:w-20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm text-teal-200">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Progress value={(currentTime / duration) * 100} className="h-1 bg-slate-700" />
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  {currentTrack.planetaryAlignment.map(planet => (
                    <Badge key={planet} className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs">
                      {planet}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-teal-300 hover:text-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-teal-300 hover:text-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-teal-300 hover:text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Playlist Tabs */}
        <Tabs value={activePlaylist} onValueChange={(value) => setActivePlaylist(value as any)} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-800/50 p-2 rounded-xl mobile-container sm:max-w-full sm:mx-0">
            {Object.entries(playlistData).map(([key, data]) => {
              const Icon = data.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="mobile-button text-xs sm:text-sm flex items-center gap-2 data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{data.title}</span>
                  <span className="sm:hidden">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(playlistData).map(([key, data]) => {
            const Icon = data.icon;
            return (
              <TabsContent key={key} value={key}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4">
                    <Icon className="h-6 w-6 text-yellow-500" />
                    <div>
                      <h2 className="text-white text-lg sm:text-xl font-semibold">{data.title}</h2>
                      <p className="text-teal-200 text-sm">{data.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3 px-4">
                    {currentPlaylistTracks.map((track, index) => (
                      <Card 
                        key={track.id} 
                        className={`mobile-card cursor-pointer transition-all duration-200 ${
                          currentTrack?.id === track.id ? 'ring-2 ring-yellow-600' : 'hover:bg-yellow-600/10'
                        }`}
                        onClick={() => playTrack(track)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <Music className="h-6 w-6 text-white" />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-white font-medium text-sm sm:text-base truncate">{track.title}</h3>
                                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                                  {track.astrologyMatch}%
                                </Badge>
                              </div>
                              
                              <p className="text-teal-200 text-xs sm:text-sm mb-2">{track.artist} • {track.duration}</p>
                              
                              <p className="text-teal-300 text-xs mb-2 line-clamp-2">{track.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={`text-xs ${getElementColor(track.elementalEnergy)}`}>
                                  {track.elementalEnergy}
                                </Badge>
                                {track.planetaryAlignment.slice(0, 2).map(planet => (
                                  <Badge key={planet} className="bg-gray-500/20 text-gray-300 border-gray-500/30 text-xs">
                                    {planet}
                                  </Badge>
                                ))}
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 h-3 rounded-full ${
                                        i < track.energyLevel / 2 ? 'bg-yellow-500' : 'bg-slate-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-teal-300 hover:text-white flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                playTrack(track);
                              }}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        </div>
      </div>
    </div>
  );
}