import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GemstoneEnergyPairing from "@/components/gemstone-energy-pairing";
import IntuitiveGemstoneVisualizer from "@/components/intuitive-gemstone-visualizer";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gem, Sparkles, Zap, Heart, Shield, Target, Brain, Wand2, Eye, Palette } from "lucide-react";

export default function GemstoneEnergyPairingPage() {
  const [activeView, setActiveView] = useState<'overview' | 'visualizer' | 'pairing'>('overview');
  const [selectedGemstones, setSelectedGemstones] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [sampleBirthData] = useState({
    firstName: "Emma",
    lastName: "Chen",
    birthDate: "1995-08-15",
    birthTime: "14:30",
    systems: {
      western: { sign: "Leo" },
      numerology: { lifePath: 7 }
    }
  });

  // Load user profile from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userBirthData');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      setUserProfile(sampleBirthData);
    }
  }, []);

  const energyTypes = [
    {
      type: "amplifying",
      icon: Zap,
      color: "hsl(44, 45%, 65%)",
      title: "Amplifying Stones",
      description: "Enhance and magnify your natural energies and intentions",
      examples: ["Clear Quartz", "Selenite", "Herkimer Diamond"]
    },
    {
      type: "balancing",
      icon: Target,
      color: "hsl(180, 25%, 55%)", 
      title: "Balancing Stones",
      description: "Harmonize conflicting energies and restore equilibrium",
      examples: ["Fluorite", "Amazonite", "Prehnite"]
    },
    {
      type: "protective",
      icon: Shield,
      color: "hsl(30, 8%, 18%)",
      title: "Protective Stones", 
      description: "Shield against negative energies and psychic attacks",
      examples: ["Black Tourmaline", "Obsidian", "Hematite"]
    },
    {
      type: "manifestation",
      icon: Wand2,
      color: "hsl(44, 45%, 65%)",
      title: "Manifestation Stones",
      description: "Transform dreams into reality through focused intention",
      examples: ["Citrine", "Pyrite", "Tiger's Eye"]
    },
    {
      type: "healing",
      icon: Heart,
      color: "hsl(44, 45%, 65%)",
      title: "Healing Stones",
      description: "Facilitate emotional, physical, and spiritual healing",
      examples: ["Rose Quartz", "Green Aventurine", "Malachite"]
    },
    {
      type: "intuitive",
      icon: Brain,
      color: "hsl(180, 25%, 55%)",
      title: "Intuitive Stones",
      description: "Awaken psychic abilities and spiritual awareness",
      examples: ["Amethyst", "Labradorite", "Moonstone"]
    }
  ];

  const handleGemstoneSelect = (gemstone: any) => {
    setSelectedGemstones(prev => {
      const exists = prev.find(g => g.id === gemstone.id);
      if (exists) {
        return prev.filter(g => g.id !== gemstone.id);
      } else {
        return [...prev, gemstone];
      }
    });
  };

  const handleEnergyChange = (energyMap: any) => {
    console.log('Energy map updated:', energyMap);
  };

  if (activeView === 'visualizer') {
    return (
      <div className="min-h-screen bg-cosmic-gradient">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back to Overview
            </Button>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
              Intuitive Gemstone Energy Visualizer
            </h1>
            <p className="text-xl text-teal-200 max-w-3xl">
              Experience your gemstone energies through interactive visualization and real-time energy flow analysis
            </p>
          </div>
          
          <IntuitiveGemstoneVisualizer
            userProfile={userProfile}
            selectedGemstones={selectedGemstones}
            onGemstoneSelect={handleGemstoneSelect}
            onEnergyChange={handleEnergyChange}
          />
        </div>
      </div>
    );
  }

  if (activeView === 'pairing') {
    return (
      <div className="min-h-screen bg-cosmic-gradient">
        <Navigation />
        <div className="container mx-auto px-6 py-20">
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => setActiveView('overview')}
              className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              ← Back to Overview
            </Button>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
              Gemstone Energy Pairing
            </h1>
          </div>
          
          <GemstoneEnergyPairing 
            onClose={() => setActiveView('overview')}
            birthData={userProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-gradient">
      <Navigation />
      
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-pink-400 bg-clip-text text-transparent">
            Gemstone Energy Pairing
          </h1>
          <p className="text-xl text-teal-200 max-w-4xl mx-auto mb-8">
            Discover the perfect gemstone combinations for your unique energy signature through advanced 
            astrological analysis and intuitive pairing technology
          </p>
          
          {/* Main Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={() => setActiveView('visualizer')}
              className="text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, hsl(44, 45%, 65%) 0%, hsl(180, 25%, 55%) 50%, hsl(30, 8%, 18%) 100%)',
                border: 'none',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              <Eye className="w-5 h-5 mr-2" />
              Interactive Visualizer
            </Button>
            
            <Button
              onClick={() => setActiveView('pairing')}
              variant="outline"
              className="text-lg px-8 py-4 rounded-xl font-semibold bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Palette className="w-5 h-5 mr-2" />
              Energy Pairing Analysis
            </Button>
          </div>
        </div>

        {/* Energy Types Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="bg-black/40 border-yellow-500/30 mb-8">
            <CardHeader>
              <CardTitle className="text-white text-2xl text-center flex items-center justify-center">
                <Zap className="mr-3 h-6 w-6 text-yellow-400" />
                Six Sacred Energy Types
              </CardTitle>
              <p className="text-gray-300 text-center">
                Each gemstone carries unique vibrational frequencies that resonate with different aspects of your cosmic blueprint
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {energyTypes.map((energy, index) => {
                  const Icon = energy.icon;
                  return (
                    <motion.div
                      key={energy.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      <Card className="bg-black/30 border-yellow-500/20 hover:border-yellow-500/50 transition-all duration-300 h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center mb-3">
                            <div 
                              className="p-2 rounded-full mr-3"
                              style={{ backgroundColor: `${energy.color}20`, border: `2px solid ${energy.color}` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: energy.color }} />
                            </div>
                            <h3 className="text-white font-semibold">{energy.title}</h3>
                          </div>
                          <p className="text-gray-300 text-sm mb-4">{energy.description}</p>
                          <div className="space-y-1">
                            {energy.examples.map((example) => (
                              <div key={example} className="flex items-center">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: energy.color }} />
                                <span className="text-gray-400 text-xs">{example}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          <Card className="bg-gradient-to-br from-teal-900/40 to-pink-900/40 border-yellow-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                Personalized Cosmic Matching
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm">Astrological sign compatibility analysis</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm">Life path number gemstone resonance</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm">Birth time energy alignment</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
                <span className="text-sm">Planetary ruler synchronization</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-teal-900/40 border-blue-400/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="mr-2 h-5 w-5 text-blue-400" />
                Advanced Energy Visualization
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                <span className="text-sm">Five-dimensional energy mapping</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                <span className="text-sm">Chakra alignment indicators</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                <span className="text-sm">Synergistic pairing recommendations</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                <span className="text-sm">Optimal timing and placement guidance</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Launch Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={() => setActiveView('visualizer')}
            className="bg-gradient-to-r from-yellow-600 via-pink-600 to-orange-500 hover:from-teal-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-yellow-600/25 transform hover:scale-105 transition-all duration-300 border-2 border-yellow-500"
          >
            <Gem className="mr-3 h-6 w-6" />
            Launch Gemstone Energy Pairing Visualizer
            <Sparkles className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-gray-400 mt-4 text-sm">
            Discover your perfect crystal companions through cosmic energy alignment
          </p>
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-black/30 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">
                How Gemstone Energy Pairing Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-white font-semibold">Cosmic Analysis</h3>
                  <p className="text-sm">Your birth data creates a unique energetic signature that resonates with specific crystal frequencies</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-white font-semibold">Energy Matching</h3>
                  <p className="text-sm">Our system calculates compatibility scores based on astrological, numerological, and vibrational alignments</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-white font-semibold">Personal Guidance</h3>
                  <p className="text-sm">Receive detailed instructions on wearing, charging, and combining stones for maximum energetic benefit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>


    </div>
  );
}